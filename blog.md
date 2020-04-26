---
title: Blog
layout: blog
description: Read the IT blog of Janos Pasztor
---

<div class="blog__header">
    <div class="blog__social">
        <div class="social">
            <h3 class="speech">Me, elsewhere</h3>
            <ul>
                <li><a href="https://pasztor.at/discord" rel="discord"><span>Discord</span></a></li>
                <li><a href="https://youtube.com/c/JanosPasztor" rel="youtube"><span>YouTube</span></a></li>
                <li><a href="https://twitter.com/janoszen" rel="twitter"><span>Twitter</span></a></li>
                <li><a href="https://www.linkedin.com/in/janoszen/" rel="linkedin"><span>Linkedin</span></a></li>
                <li><a href="https://github.com/janoszen" rel="github"><span>Github</span></a></li>
                <li><a href="https://facebook.com/pasztor.at" rel="facebook"><span>Facebook</span></a></li>
            </ul>
        </div>
    </div>
    <h2>Blog</h2>
    <div class="blog__latest">
        <div class="blog__latest__first">
            <h3>Latest post</h3>
            {% assign posts = site.categories.blog | where_exp:"post","post.date < site.time" %}
            {% for post in posts limit:1 %}
                {% include wall-post.html post=post %}
            {% endfor %}
        </div>
        <div class="blog__latest__rest">
            <h3>Recent posts</h3>
            {% assign posts = site.categories.blog | where_exp:"post","post.date < site.time" %}
            {% for post in posts limit:3 offset:1 %}
                {% include wall-post-small.html post=post %}
            {% endfor %}            
        </div>
    </div>
</div>
