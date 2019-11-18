---
layout:        post
title:         "Getting started with Docker for the Inquisitive Mind"
date:          "2019-11-25"
categories:    blog
excerpt:       "There are a million Docker tutorials out on the Internet, but few explain what's actually going on behind the scenes when you issue your first commands. So let's take a look!"
preview:       /assets/img/docker-for-beginners.jpg
fbimage:       /assets/img/docker-for-beginners.png
twitterimage:  /assets/img/docker-for-beginners.png
googleimage:   /assets/img/docker-for-beginners.png
twitter_card:  summary_large_image
tags:          [Docker, DevOps]
sharing:
  twitter:  "New post: Getting started with Docker for the Inquisitive Mind"
  facebook: "New post: Getting started with Docker for the Inquisitive Mind"
  linkedin: "New post: Getting started with Docker for the Inquisitive Mind"
  patreon:  "New post: Getting started with Docker for the Inquisitive Mind"
  discord:  "@everyone New post: Getting started with Docker for the Inquisitive Mind"
---

Ok, so you have decided to start doing something with Docker but you don't even know what is what and how this
whole thing works? Maybe you've read a couple of tutorials but you have no clue what you are doing? Then this is the
post for you.

## The Docker architecture

Assuming you have followed the official documentation and installed Docker on [Ubuntu](https://docs.docker.com/v17.12/install/linux/docker-ce/ubuntu/)
or on [Windows](https://docs.docker.com/v17.12/docker-for-windows/install/), you must question yourself: what is this
Docker thing?

Think of it like a very advanced tool to run a virtual machine. Yes, it's not really a VM, but let's stick with this
crude analogy for now. What you have installed are two things: the `docker` command (client) and `dockerd` (server).
When you open a command line / terminal and type `docker run -ti ubuntu` you actually call the client, which then
connects to `dockerd` on your behalf and asks it to run a container (almost a VM) from an *image* called
*&ldquo;ubuntu&rdquo;*. This *image* is basically a packaged version of an operating system which is used as a *golden
master* to create a copy from. This copy then becomes the *container* itself. (There is a lot more stuff going on behind
the scenes, but let's keep it simple for now.)

> **Hint for WSL:** If you are trying to access your Docker Desktop on WSL1 (Windows), you will have to enable
> *Expose daemon on tcp://localhost:2375 without TLS* and run docker as `docker -H tcp://localhost:2375` in order to
> use the Docker Desktop daemon. WSL2 will fix this by allowing you to run Docker natively within WSL.

Where does this image come from? Unless you have specified a name that references a private image server
(called a *registry*), `dockerd` will try to first look locally in its own storage for the image, and if it is not found,
it will contact the [Docker Hub](https://hub.docker.com) to look if the image is available there. If it is, it will 
download said image and cache it locally.

It is worth keeping in mind that every time you run `docker run`, a *new* container is created from the image, so
any modifications you may have made in the old one are not transferred to the new one. This plays heavily into the 
philosophy of Docker: the image build process and the ultimate execution of an image to create a container are two
separate steps. The image build process should produce an image that is reusable dozens, or even hundreds of times to 
create an army of nearly identical containers. Images must be *reusable*. Therefore, it is not advisable to go in and
edit the contents of a container.

It is also worth noting that the containers you start are running on a *separate, virtual network* where each container
has its own unique IP address. Services started in a container are not automatically available from the machine you are
running them on. Docker, however, has a clever feature where it will run a *proxy* that forwards connections to the
appropriate container, if you ask it to. 

> **Further reading:** If you want to know how exactly containers work, I would recommend reading my post titled [Docker 101: Linux Anatomy](/blog/docker-101-anatomy).

## Running your first container

Enough theory already, let's get to the meat of it. Let's start a container with an Ubuntu Linux in it. Open a terminal
and type the following:

```
docker run ubuntu
```

> **Remember:** If you are on WSL1, you will need to run `docker -H tcp://localhost:2375 run ubuntu` here!

You will see something like this:

```
C:\Users\janoszen>docker run ubuntu
Unable to find image 'ubuntu:latest' locally
latest: Pulling from library/ubuntu
7ddbc47eeb70: Pull complete
c1bbdc448b72: Pull complete
8c3b70e39044: Pull complete
45d437916d57: Pull complete
Digest: sha256:6e9f67fa63b0323e9a1e587fd71c561ba48a034504fb804fd26fd8800039835d
Status: Downloaded newer image for ubuntu:latest

C:\users\janoszen>
```

OK, what just happened? First of all, it is clearly visible that Docker just *pulled* the Ubuntu image from the Docker
Hub, but then... nothing happened? Ok, let's investigate. Let's take a look at the running containers:

```
C:\Users\janoszen>docker ps
CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES

C:\Users\janoszen>
```

That's ... unfortunate. No container is currently running, so something clearly went wrong. Let's take a look at all
the containers, including the non-running ones:

```
C:\Users\janoszen>docker ps -a
CONTAINER ID   IMAGE    COMMAND       CREATED          STATUS                      PORTS   NAMES
78bb7a8bd601   ubuntu   "/bin/bash"   30 seconds ago   Exited (0) 30 seconds ago           kind_almeida

C:\Users\janoszen>
```

OK, so the container was clearly *created*, and it also started, but it immediately stopped. If you look at the 
*command* that is being run, that's `/bin/bash`. Bash is a shell script interpreter, so it expects a shell script to
run, unless it is run *interactively*, where you can type. You might assume that's automatic, since you are typing out
the Docker commands interactively, but Docker doesn't quite know that, you need to tell it. Let's try this:

```
C:\Users\janoszen>docker run -ti ubuntu
root@f549dcd7db3c:/#
```

Much better! As you can see with the `-ti` added we are now get a Bash prompt where we can type Linux commands. Feel
free to use this to run any Linux commands you want, but keep in mind, this container is running separated from the 
machine you are running it on and you won't have access to any data that you may have on the host machine. We will fix
that later. When you are done, hit `Ctrl+D` to exit the prompt.

If you now run `docker ps -a` you will now see that there are two stopped containers:

```
C:\Users\janoszen>docker ps -a
CONTAINER ID   IMAGE    COMMAND       CREATED         STATUS                     PORTS   NAMES
f549dcd7db3c   ubuntu   "/bin/bash"   5 minutes ago   Exited (0) 5 seconds ago           condescending_borg
99e2e0e176e8   ubuntu   "/bin/bash"   8 minutes ago   Exited (0) 8 minutes ago           xenodochial_euler
```

This is an important lesson to learn: as soon as the program that you started in a container quits, your container
dies. In contrast to *real* virtual machines, containers do not have a real operating system running, only the single
application you want to run.

## Investigating the container

So let's hop into our container once more and take a look around:

```
C:\Users\janoszen>docker run -ti ubuntu
root@c78e8f6a792c:/#
```

### Processes

As a first command let's take a look at the processes that are running:

```
root@c78e8f6a792c:/# ps auwfx
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  1.0  0.1  18504  3520 pts/0    Ss   20:59   0:00 /bin/bash
root        10  0.0  0.1  34396  2896 pts/0    R+   20:59   0:00 ps auwfx
```

As you can see, in the container you only see the processes running inside the container. You don't see any of the
processes running outside the container. In contrast, if you are running Docker on a Linux system, the same command
on the *host system* shows you the processes inside the container:

```
janoszen@janoszen-laptop:~$ ps awufx
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
...
root      5197  0.1  0.1 696940 40468 ?        Ssl  21:07   0:03 /usr/bin/containerd
root     12791  0.0  0.0  10604  4620 ?        Sl   22:01   0:00  \_ containerd-shim -namespace moby -workdir /var/lib/containerd/io.con
root     12818  3.3  0.0  18508  3048 pts/0    Ss+  22:01   0:00      \_ /bin/bash
...
root      5249  0.5  0.3 912428 115696 ?       Ssl  21:07   0:16 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
```

As you can see the program we started inside the container is just running as a normal process, not a real virtual
machine. It is *possible* to run a container as a real virtual machine, for example for security purposes if the workload
is untrusted, but containers in general run all under the same operating system, which makes them very efficient.

Now, let's investigate how containers are connected. For that we will need to install the `iproute2` utility in our
container:

```
root@c78e8f6a792c:/# apt update && apt install -y iproute2
```

### Network

Then we can take a look at the network interfaces:

```
root@c78e8f6a792c:/# ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
...
75: eth0@if76: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default
    link/ether 02:42:ac:11:00:02 brd ff:ff:ff:ff:ff:ff link-netnsid 0
    inet 172.17.0.2/16 brd 172.17.255.255 scope global eth0
       valid_lft forever preferred_lft forever
```

As you can see this container has it's own IP address, `172.17.0.2/16`. We can investigate the connectivity further by
running the `ip route` command:

```
root@c78e8f6a792c:/# ip route
default via 172.17.0.1 dev eth0
172.17.0.0/16 dev eth0 proto kernel scope link src 172.17.0.2
```

So the container is running in a network, and it's *default gateway* is `172.17.0.1`. If you are running Docker on Linux
you can simply take a look at this IP from the host:

```
janoszen@janoszen-laptop:~$ ip addr show dev docker0
4: docker0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP group default 
    link/ether 02:42:7e:a1:1e:73 brd ff:ff:ff:ff:ff:ff
    inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
       valid_lft forever preferred_lft forever
    inet6 fe80::42:7eff:fea1:1e73/64 scope link 
       valid_lft forever preferred_lft forever
```

In Docker on Windows the situation is a bit more complicated, but suffice it to say, the default network configuration
is such that the containers have their own virtual network interfaces and they are connected over this virtual network
with the operating system actually running them. On the host operating system the network traffic gets send to the
internet via a NAT (Network Address Translation), so that any outgoing traffic appears to come from the IP address of
the host.

There are, of course, different and more complicated network setups, especially when Docker is running in Swarm mode,
but we'll leave that for later.

### Disks

Finally, let's take a look at the disks:

```
root@c78e8f6a792c:/# mount
overlay on / type overlay (rw,relatime,lowerdir=/var/lib/docker/overlay2/l/2D3RNPVHGDWACR6CZNIFGAFTWN:/var/lib/docker/overlay2/l/JHWG4KJ36FYJMIZ5ZIOO7J65F6:/var/lib/docker/overlay2/l/5QHL4NCFJSHV4GFAD35FAMNSIP:/var/lib/docker/overlay2/l/6M6LB3P7J6THDIO5DDAM5HSPEL:/var/lib/docker/overlay2/l/3ESZKSBYWFGENR6X7RHLTZRMJR,upperdir=/var/lib/docker/overlay2/193fcd23d36998f2e17108cf5317ceab0881ea3105964df6ef11e3329ee3cbed/diff,workdir=/var/lib/docker/overlay2/193fcd23d36998f2e17108cf5317ceab0881ea3105964df6ef11e3329ee3cbed/work)
...
/dev/sda1 on /etc/resolv.conf type ext4 (rw,relatime,data=ordered)
/dev/sda1 on /etc/hostname type ext4 (rw,relatime,data=ordered)
/dev/sda1 on /etc/hosts type ext4 (rw,relatime,data=ordered)
...
```

The `mount` command lists all the drives and devices that have been activated in our Linux system. If you are 
familiar with this command, you will find this output a bit strange. The root filesystem (`/`) is mounted not 
as a normal filesystem, but something called `overlay`.

This overlayfs is also an important part of Docker. It allows Docker to create a container without copying the whole
image. Instead, only the files that are modified in each container from the image are stored. What's more, even images
can have multiple *layers* and only the difference to the previous layer is stored. This makes for very efficient 
updates of images when only one of the layers have changed.

## Creating a <del>Docker</del> <ins>container</ins> image

Ok, so we need to address the elephant in the room: it's not a Docker image. It's a container image. The reason behind
this is that what once was the Docker image format has now been standardized and can be used with Docker, Kubernetes, or
any other container tool.

So let's build one. In Docker we do this using a file called a `Dockerfile`. This `Dockerfile` contains a list of
commands that need to be executed in order to produce the image. Having a file like this is very important because
then we not only have our image that works everywhere, but we also have the *recipe* how we created our image.

Ideally, the image build process is integrated in your CI/CD pipeline, such that whenever you change your `Dockerfile`,
the image is automatically rebuilt and pushed to your company registry. But more on that later.

So, let's get started with out `Dockerfile`. Our first command will be the `FROM` command. This command will tell Docker
when base image to use. For example, you could use `ubuntu`, which will pull in the latest Ubuntu, or even a specific
version, such as `ubuntu:16.04`. Needless to say, you can also say `FROM scratch`, which will start from an empty
container image, but this is only useful if you are working in a language like Go.

Be careful though, anyone can create and publish an image on the Docker Hub. Even official images often have flaws and 
may not be as well maintained as one would expect, not to mention third party images. Be conservative when using
images by other people.

So, let's get started:

```Dockerfile
FROM ubuntu
```

So far so good. Let's build it, run the following in the directory you saved your `Dockerfile`:

```
C:\Users\janoszen\docker-test>docker build .
Sending build context to Docker daemon  2.048kB
Step 1/1 : FROM ubuntu
 ---> 775349758637
Successfully built 775349758637
```

The build command takes one compulsory parameter, the path to the `Dockerfile`, which is pointed to the current
directory by specifying the dot (`.`).

This build process means that all the files in the current directory are packed up by the Docker client and are sent
to `dockerd`, which is indicated by the first line (`Sending build context...`). The image is then build, which
consists of one command (`FROM`).
 
However, if you are on Windows, you will get this security warning:

```
SECURITY WARNING: You are building a Docker image from Windows against a
non-Windows Docker host. All files and directories added to build context
will have '-rwxr-xr-x' permissions. It is recommended to double check and
reset permissions for sensitive files and directories.
```

This warning is issued due to how Linux/Unix permissions are differend from Windows. If you build a Linux container on
a Windows host, all files added via the `COPY` or `ADD` commands (more on those later) will have the executable
permission. This is less than ideal since all files added will be executable. You can, of course, fix this issue by 
adding commands to the build process to set the permissions, but this is a good reason for using WSL instead of the 
Windows command line to run the build commands. Needless to say, for production uses this should be integrated in your
CI/CD pipeline anyway and you shouldn't build images by hand.

Now, setting Windows issues aside how do we use this image? We can, of course, reference the image by it's ID, but that
would be rather ugly:

```
C:\Users\janoszen\docker-test>docker run -ti 775349758637
```

Instead, we should always *tag* our images with a name:

```
C:\Users\janoszen\docker-test>docker build -t my-first-image .
Sending build context to Docker daemon  2.048kB
Step 1/1 : FROM ubuntu
 ---> 775349758637
Successfully built 775349758637
Successfully tagged my-first-image:latest
```

The *tag* basically names the image. It is customary to specify the image names in the format of
`companyname/imagename`. This is especially important if you want to publish to the Docker Hub, as the image name
will be your user or organization name, followed by the image name. If you want to push to a private registry, you will
need to use the registry URL instead, such as `gcr.io/[PROJECT-ID]/[IMAGE]` for the Google Cloud Registry.

Another important aspect of tagging is *versioning*. If you don't specify a version for an image tag, it will default to
`latest`. In other words the image name `ubuntu` is exactly the same as `ubuntu:latest`. However, if you are working
in a serious environment you really should *version* your containers so you can easily roll back to the previous one.

So the build command should really look like this:

```
C:\Users\janoszen\docker-test>docker build -t mynick/my-first-image:1.0.0 .
```

Great! Our first image is done and properly tagged! If we so desire we can issue a `docker login` command to log in to 
the Docker Hub and `docker push` our image there. I'll leave it to you as an exercise to figure out.


Now, if you run this image you will notice that we haven't really done anything terribly useful yet. So let's change
this container to run a shell script. As a first step let's create a script called `hello.sh` in the directory where
your `Dockerfile` is located, with the following content:

```bash
#!/bin/bash

echo "Hello world!"
``` 

> **Be careful about Windows line breaks!** If you edit this file on Windows you may get the cryptic error
> `standard_init_linux.go:211: exec user process caused "no such file or directory"`. This is caused by the 
> invisible carriage return character (`\r`) after `#!/bin/bash`. Make sure you use an editor that can save in the 
> Linux file format with only the line feed character (`\n`) as a line ending.

I know, I should really come up with something more creative. Anyway, let's copy this shell script to our container
during the build process:

```
FROM ubuntu
COPY hello.sh /hello.sh
```

This will take hello.sh into the root directory of the image. Alternatively you can use the `ADD` command too, which 
has the advantage over `COPY` that it can add files from a HTTP URL, and also extract `.tar` archives in the process.

Ok, so the script has been added, but it doesn't do anything yet. As a next step we need to change the files permissions
so it can be executed:

```
FROM ubuntu
COPY hello.sh /hello.sh
RUN chmod +x /hello.sh
```

Finally, we need to state that instead of running an interactive shell, we should run our `hello.sh`. This is done
using the `CMD` command:

```
FROM ubuntu
COPY hello.sh /hello.sh
RUN chmod +x /hello.sh
CMD ["/hello.sh"]
```

If we have done everything correctly, after a build our container should now run properly:

```
C:\Users\janoszen\docker-test>docker run my-first-image
Hello world!

C:\Users\janoszen\docker-test>
```

Note that we did not need `-ti` this time, since the program is not running interactively. Our shell script was executed
and it output what we requested.

Now, let's talk about `CMD` a little. You may see two forms of `CMD`:

- `CMD ["/hello.sh", "--parameter1", "--paramater2"]`
- `CMD /hello-sh --parameter1 --parameter2`

My recommendation is that you *always* use the former. The reason for that is that the second one starts an extra shell
(bash) before it launches your program, which will cause all sorts of issues later, for example the container will
refuse to stop properly.

## Creating a webserver

Now that we have the basics sorted, let's create a more complex example by
<del>dockerizing</del><ins>containerizing</ins> a webserver. We start by creating a Dockerfile based on Ubuntu:

```Dockerfile
FROM ubuntu
``` 

Next we want to install Ubuntu. We do this by first updating the package cache, then installing nginx:

```Dockerfile
FROM ubuntu
RUN apt update
RUN apt install -y nginx
```

Now, this is not ideal because your APT package cache will be stored in the second layer, so there will be data in the
container that we don't need when we run it, making the image unnecessarily large. Let's follow the
[Best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/) and
pull these layers together and remove the APT cache in the same step:

```Dockerfile
FROM ubuntu
RUN apt update && \
    apt install -y nginx && \
    rm -rf /var/lib/apt/lists/*
```

Since the `RUN` command is running everything in a single step and the cache is removed immediately, the cache will not
be recorded in the image.

Now that we have nginx installed we can document that this server will be listening on port 80:

```Dockerfile
FROM ubuntu
RUN apt update && \
    apt install -y nginx && \
    rm -rf /var/lib/apt/lists/*
EXPOSE 80
```

Note that the `EXPOSE` command does not *publish* the service on your host machine, it simply documents that port 80 is
a service that this container provides.

Now that that's sorted, let's add the `CMD`. How do we know what the proper CMD is? This is a tricky question, so let's
build and start the image we have so far in interactive mode:

```
C:\Users\janoszen\nginx>docker build -t my-nginx .
...
C:\Users\janoszen\nginx>docker run -ti my-nginx
```

Now let's take a look at the installed `nginx` package contents:

```
root@ac0b6e5fb102:/# dpkg -L nginx
/.
/usr
/usr/share
/usr/share/doc
/usr/share/doc/nginx
/usr/share/doc/nginx/copyright
/usr/share/doc/nginx/changelog.Debian.gz
```

Hm.... this seems to be only documentation. Let's actually look at what packages are installed:

```
root@ac0b6e5fb102:/# dpkg -l |grep nginx
ii  libnginx-mod-http-geoip        1.14.0-0ubuntu1.6        amd64        GeoIP HTTP module for Nginx
ii  libnginx-mod-http-image-filter 1.14.0-0ubuntu1.6        amd64        HTTP image filter module for Nginx
ii  libnginx-mod-http-xslt-filter  1.14.0-0ubuntu1.6        amd64        XSLT Transformation module for Nginx
ii  libnginx-mod-mail              1.14.0-0ubuntu1.6        amd64        Mail module for Nginx
ii  libnginx-mod-stream            1.14.0-0ubuntu1.6        amd64        Stream module for Nginx
ii  nginx                          1.14.0-0ubuntu1.6        all          small, powerful, scalable web/proxy server
ii  nginx-common                   1.14.0-0ubuntu1.6        all          small, powerful, scalable web/proxy server - common files
ii  nginx-core                     1.14.0-0ubuntu1.6        amd64        nginx web/proxy server (standard version)
```

Aha! So the nginx application is actually in `nginx-core` which was pulled in as a dependency. Let's look at the
contents:

```
root@ac0b6e5fb102:/# dpkg -L nginx-core
/.
/usr
/usr/sbin
/usr/sbin/nginx
/usr/share
/usr/share/doc
/usr/share/doc/nginx-core
/usr/share/doc/nginx-core/copyright
/usr/share/man
/usr/share/man/man8
/usr/share/man/man8/nginx.8.gz
/usr/share/doc/nginx-core/changelog.Debian.gz
```

If you look at this list carefully, you will see that there is a *binary* named `/usr/sbin/nginx`. We will assume that
this is the program we will want to run, so let's add the `CMD` part to the Dockerfile:


```Dockerfile
FROM ubuntu
RUN apt update && \
    apt install -y nginx && \
    rm -rf /var/lib/apt/lists/*
EXPOSE 80
CMD ["/usr/sbin/nginx"]
```

Ok, let's build and run this container, this time *publishing* port 80 on the host so we can actually access it:

```
C:\Users\janoszen\nginx>docker build -t my-nginx .
...
C:\Users\janoszen\nginx>docker run -p 80:80 my-nginx
```

... aaaand the container stops immediately. Womp womp. Now you can go about spending a great deal of time debugging
the issue, but let me just reveal the secret: the container stops immediately because nginx, like many server 
applications, *daemonizes*.

Daemonization means that the application goes into the background and gives you back your console control. In contrast,
some applications start in the foreground, so you won't be able to use the console you started the application from 
because the application will be occupying it.

Remember what we said before? If you quit the application you start in the container, the entire container dies. This
is exactly what happens with daemonized applications because daemonization involves starting a child process and exiting
the main process to give back control. So, in order to run nginx in a container we will need to stop nginx from
daemonizing. After a bit of googling let's change our `CMD` to do just that:

```Dockerfile
FROM ubuntu
RUN apt update && \
    apt install -y nginx && \
    rm -rf /var/lib/apt/lists/*
EXPOSE 80
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
```

Wow! That's it! If we now start this container and open [http://localhost/](http://localhost) we will see the default
nginx page come up. Cool!

Now on to the meat of the matter, let's add a website. Let's create an `index.html` to that end:

```html
<html><body><h1>Hello world!</h1></body></html>
``` 

Then we can copy the file into the container:

```Dockerfile
FROM ubuntu
RUN apt update && \
    apt install -y nginx && \
    rm -rf /var/lib/apt/lists/*
EXPOSE 80
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
COPY index.html /var/www/html/index.html
```

> **Note:** we issue the `COPY` command last so when we change the HTML file we don't need to reinstall nginx and allow
> Docker to use the already built layers.

Ok, so we have our website in the container.

> **Note:** if you `Ctrl+C` out of `docker run`, the container will stop. If you want to run the container in
> background, use the `-d` flag.

How about if we want to change the configuration file? Let's do a bit of 
digging. Let's enter the running container. To do that we will first find the container ID of the running nginx
container, which we can do using `docker ps`:

```
C:\Users\janoszen\nginx>docker ps
CONTAINER ID   IMAGE      COMMAND                  CREATED         STATUS          PORTS                NAMES
cd19c4cf8d71   my-nginx   "/usr/sbin/nginx -g …"   4 minutes ago   Up 4 minutes    0.0.0.0:80->80/tcp   nostalgic_turing
```

> **Note:** You can *name* your containers using the `--name` parameter for run, but you should not rely on naming
> containers as you will delete and recreate them a lot.

Now that you have the container ID, you can actually launch a shell into the running container:

```
C:\Users\janoszen\nginx>docker exec -ti cd19c4cf8d71 /bin/bash
root@cd19c4cf8d71:/#
```

If your container is not running, you can alternatively override the `CMD` when running the container:

```
C:\Users\janoszen\nginx>docker run -ti my-nginx /bin/bash
```

This will start the container with a shell in it. Either way, we can now poke around in the container to find
the configuration files. Let's go to `/etc/nginx` to take a look:

```
root@cd19c4cf8d71:/# cd /etc/nginx
root@cd19c4cf8d71:/etc/nginx# find
.
./fastcgi.conf
./modules-enabled
./modules-enabled/50-mod-stream.conf
./modules-enabled/50-mod-http-image-filter.conf
./modules-enabled/50-mod-http-xslt-filter.conf
./modules-enabled/50-mod-mail.conf
./modules-enabled/50-mod-http-geoip.conf
./mime.types
./sites-available
./sites-available/default
./koi-utf
./scgi_params
./win-utf
./sites-enabled
./sites-enabled/default
./conf.d
./koi-win
./modules-available
./nginx.conf
./snippets
./snippets/snakeoil.conf
./snippets/fastcgi-php.conf
./uwsgi_params
./proxy_params
./fastcgi_params
```

You can see that there are multiple configuration files. The base config file is `nginx.conf`. If you use
`cat nginx.conf`, you can see that this configuration file also pulls in other config files:

```
include /etc/nginx/conf.d/*.conf;
include /etc/nginx/sites-enabled/*;
```

This is significant because other software often do this. If we keep digging around we will find that the default 
virtual host is located in `/etc/nginx/sites-available/default`, where we will find roughly the following content:

```
root@cd19c4cf8d71:/etc/nginx/sites-available# cat default 
##
# You should look at the following URL's in order to grasp a solid understanding
# ...
server {
	listen 80 default_server;
	listen [::]:80 default_server;

	root /var/www/html;

	index index.html index.htm index.nginx-debian.html;

	server_name _;

	location / {
		# First attempt to serve request as file, then
		# as directory, then fall back to displaying a 404.
		try_files $uri $uri/ =404;
	}
}
```

Now, if you have used `docker exec` to get into the running container you can change this config file and run
`kill -HUP 1` to reload the nginx config. Other software, like Apache, will need a different technique to reload
the config while running.

> **Note:** since we are not running in a real operating system, management services like systemd, are not running, so
> you can't simply restart a service.

Now that you have the config file changed, you can transfer the changes outside the container. Simply create
a file next to your `Dockerfile` called `default` and use the `COPY` operation to move the config file in the
container.