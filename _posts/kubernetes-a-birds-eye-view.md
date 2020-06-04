---
layout:        post
title:         "Kubernetes: A birds eye view"
date:          "2020-04-27"
categories:    blog
excerpt:       "Kubernetes is the new hotness of application deployment and DevOps, so it's time to take a flyover view how it works."
preview:       /assets/img/kubernetes-birds-eye-view.jpg
fbimage:       /assets/img/kubernetes-birds-eye-view.png
twitterimage:  /assets/img/kubernetes-birds-eye-view.png
googleimage:   /assets/img/kubernetes-birds-eye-view.png
twitter_card:  summary_large_image
tags:          [DevOps, Kubernetes]
sharing:
  twitter:  "Kubernetes: A birds eye view"
  facebook: "Kubernetes: A birds eye view"
  linkedin: "Kubernetes: A birds eye view"
  patreon:  "Kubernetes: A birds eye view"
  discord:  "@everyone Kubernetes: A birds eye view"
---

I have [written a bit](/tags/kubernetes) about [Kubernetes](https://kubernetes.io/) before, but it's time for one of my
longer articles, taking a look at how it actually works.

## Containers

Before we dive into Kubernetes we have to take a look at containers themselves. Unlike
[in my previous posts](/tags/docker) I won't go into too much detail here, so feel free to skip this section if you are
familiar with what containers are.

So, containers. Originally, deploying software on Linux or Windows happened directly on the operating system. You would
take the software, install it and run it directly from your Windows or Linux machine. First this happened on physical
hardware, later on in virtual machines, but with a common scenario: there was always a full operating system with all
the services, and more importantly, the kernel that is supposed to talk to the hardware in play.

Around the mid 2000's several independent projects started to realize that there is a more efficient way to isolate
programs from each other by skipping the &ldquo;guest&rdquo; kernel entirely and only keeping the host operating
system's kernel. Instead, they would modify the host kernel to be able to differentiate between the virtual environments
purely based on the program that would run.

These projects, like [Linux-VServer](http://linux-vserver.org/) and more importantly [OpenVZ](https://openvz.org/) were
the basis for the mainline implementation of process isolation in the Linux kernel. Companies like Google, IBM, SGI and
Bull put a lot of resources into taking OpenVZ apart and bit by bit pushing it into Linux itself. This meant that you
no longer had to patch the Linux kernel, but had features out of the box. These features included, for example,
cgroups, which were a reimplementation of the User Beancounters in OpenVZ and are, to this day, responsible for limiting
the resources a group of processes can use. Other features included, for example PID namespaces, which made it possible
to show a process only a portion of the processes that were actually running.

> If you are interested in the details of these isolation features feel free to read my posts titled
> [Docker 101: Anatomy](/blog/docker-101-anatomy) and [Under the hood of Docker](/blog/under-the-hood-of-docker).

With containerization in the mainline Linux kernel the doors were open to projects like
[LXC](https://linuxcontainers.org/lxc/introduction/) to thrive for a short time. LXC was intended as a replacement for
OpenVZ simply making it possible to run a guest operating system without having to carry the weight of the additional
kernel.

However, soon a new challenger arrived: [Docker](https://www.docker.com/). Docker came with a radically new idea.
Instead of simply providing a mutable operating system which you had to maintain, patch and generally take care of,
you now had to write a *recipe* on building an image for the container and then simply run it. The installation
procedure was documented in a file called `Dockerfile`. This installation procedure provided a big step forward to an
[immutable infrastructures](/blog/immutable-infrastructure).  It provided a reproducible recipe to build the container
image. When you ran this container image, it would always run the same way. (If you built it correctly, that is.)

## Orchestration

With Docker on the scene, one important aspect was left open: how do you deal with running containers on a cluster
of machines? The answer came in the form of container orchestrators. Docker Swarm, Kubernetes and Mezos were some of the
contenders for the king of the hill, but Kubernetes, having the backing of Google and other large companies, and the
history of [the Borg orchestrator from Google behind it](https://kubernetes.io/blog/2015/04/borg-predecessor-to-kubernetes/)
today it clearly won the race for the most used orchestrator.

What is an orchestrator, you may ask? Imagine that you are deploying a web application. It needs a database, an
application server, a reverse proxy, and maybe a cache. In a classic Docker-based scenario this might be four containers
networked together using [docker-compose](https://docs.docker.com/compose/) on a single machine. However, things
become quite complicated when you want to use multiple servers. Who decides which server to run each container on? Who
deals storage? Or load balancing if you have multiple orchestrators?

## Kubernetes

These are all things that Kubernetes does for you. Kubernetes is a rather complex set of applications that ultimately
provide you with an API you can talk to. This API lets you deploy an application without having to SSH into a server and
worry about the actual machine.

Needless to say, simply using Kubernetes doesn't free you from the burden of having to deal with updates in your
containers, and you will often be responsible for managing the worker servers (nodes) even if you use Kubernetes from
a cloud provider.

## Deployments

One if the fundamental things you can do with the API it provides is create
[deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/). Deployments allow you to
define a set of containers that should be run, and with which parameters.

When a deployment actually executes it will launch one or more *Pods*. Each pod will contain a set of your containers
that you have defined, and as a bonus, the services in these containers can communicate on the local network interface
(`localhost`, `127.0.0.1`).

## Networking, services and ingress

Having a deployment is not very useful in and of itself, since these deployments need to be accessible to other
deployments and to the outside world. This is done using an object called
[a Service](https://kubernetes.io/docs/concepts/services-networking/service/). Services provide an internal load
load balancer that other services can use. Additionally, they can also publicly expose the service.

The public exposure is done either using `NodePort`, which will publish the service on a random port (not very useful)
or a load balancer, which will communicate to your cloud providers load balancer. (You can run this yourself too with,
for example, [MetalLB](https://metallb.universe.tf/).)

Alternatively you can make your life even more convenient as Kubernetes also has a way to manage reverse proxies, such
as [nginx](https://github.com/kubernetes/ingress-nginx) or [Traefik](https://docs.traefik.io/providers/kubernetes-ingress/).
These reverse proxies are called *ingress controllers* in Kubernetes lingo and you can create a rule for them using
an [Ingress resource](https://kubernetes.io/docs/concepts/services-networking/ingress/). Apart from HTTP routing ingress
controllers often also take care of certificate management for you.

All the internal communication is done using a network provided by a third party tool plugged into Kubernetes using the
[Container Network Interface (CNI) API](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/).
There are a plethora of plugins, some adapting native capabilities of cloud providers, others creating a mesh VPN
between your Kubernetes nodes. 

## Storage management

Some pods will require a persistent data storage that survives a pod recreation. These are called
[Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/). Of course, PVs can be mounted
from the host machine, but in order to move around containers between servers it is useful to have either a network 
block storage, or a network file system. When Kubernetes moves a pod to a different node it can also move the volume
mount. This may not be a requirement for every application, but larger deployments most certainly will want to make use
of it.

> **Warning!** Using a network block storage or network file system doesn't save you from having a sound backup
> strategy! Data can still be deleted on the application level, and cloud providers are not infallible either!

## Getting your first application kuberneticized

Now that we have taken a gander through some of the features Kubernetes has to offer, let's depoy a sample
application. Before we even begin working on the Kubernetes part, we will need to make sure that our container images
are built properly. To do that we will go back to our trusty Docker.


