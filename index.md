---
layout: home
description: Latest posts by Janos Pasztor
---

<div class="hero">
    <div class="hero__contents">
        <div class="hero__background">
            <h2 class="speech" id="aboutme">About me</h2>
            <div class="speech">
                <a href="#after-hero">Skip about me</a>
            </div>
            <div class="hero__title">
                Public Speaker,<br />
                Trainer, Author.
            </div>
            <div class="hero__subtitle no-speech">
                <span class="hero__line">DevOps Educator with 10+ Years</span> <span class="hero_line">of Experience in the Field</span>
            </div>
            <div class="hero__elsewhere">
                <div class="hero__contact social">
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
                <div class="hero__getintouch">
                    <a href="/contact">
                        <button class="btn btn-lg">Get in Touch</button>
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div id="after-hero"></div>
</div>
<div class="signup">
    <h2 id="getnotified">
        <span class="signup__line">Get notified. Stay tuned and be the first</span>
        <span class="signup__line">to hear about new updates.</span>
    </h2>
    <div class="speech">
        <a href="#after-signup">Skip newsletter section</a>
        <a href="#top">Back to top</a>
    </div>
    <form action="/signup" method="post">
        <label>
            <span>What's your name?</span>
            <input type="text" autocomplete="name" placeholder="How should I call you?" />
        </label>
        <label>
            <span>What's your e-mail?</span>
            <input type="email" autocomplete="email" placeholder="What's your e-mail address?" />
        </label>
        <button type="submit">Subscribe</button>
    </form>
    <div class="disclaimer">
        No spam, just DevOps content. Read more about how your e-mail address is being handled in my <a href="/privacy">Privacy Policy</a>.
    </div>
    <div id="after-signup"></div>
</div>
<div class="recent">
    <h2 id="recent">Recent Posts</h2>
    <div class="speech">
        <a href="#after-recent">Skip recent posts</a>
        <a href="#top">Back to top</a>
    </div>
    <div class="post__list" itemscope itemtype="http://schema.org/ItemList http://schema.org/BlogPosting">
        {% assign posts = site.categories.blog | where_exp:"post","post.date < site.time" %}
        {% for post in posts limit:6 %}
            <hr class="speech" />
            {% include wall-post.html post=post %}
        {% endfor %}
    </div>
    <div class="recent__gotoblog">
        <a href="/blog">See {{ posts | size | minus: 6 }} more posts &raquo;</a>
    </div>
    <div id="after-recent"></div>
</div>
{% comment %}{% raw %}
<div class="events">
    <h2>Upcoming Events</h2>
    <div class="speech">
        <a href="#after-events">Skip events</a>
        <a href="#top">Back to top</a>
    </div>
    <div class="events__list">
        {% for post in posts limit:4 %}
        <a href="#" class="events__event">
            <time class="events__time">
                <span class="events__date">
                    <span class="events__datedetails">
                        <span class="events__day">22</span>
                        <span class="events__monthyear">
                            JUN 2020
                        </span>
                    </span>
                </span>
                <span class="events__hours">
                    09 PM &mdash; 10 PM
                </span>
            </time>
            <div class="events__details">
                <div class="events__location">Vienna</div>
                <h3>Workshop 1</h3>
                <div class="events__description">
                    Explanation of what the workshop or talk is about. Lorem ipsum very long text
                    to fill the void and break the layout.
                </div>
                <div class="events__tags">
                    <span class="events__tag">Workshop</span>
                    <span class="events__tag">DevOps</span>
                    <span class="events__tag">Exoscale</span>
                </div>
            </div>
        </a>
        <a href="#" class="events__event">
            <time class="events__time">
                <span class="events__date">
                    <span class="events__datedetails">
                        <span class="events__day">22</span>
                        <span class="events__monthyear">
                            JUN 2020
                        </span>
                    </span>
                </span>
                <span class="events__hours">
                    09 PM &mdash; 10 PM
                </span>
            </time>
            <div class="events__details">
                <div class="events__location">Vienna</div>
                <h3>Workshop 1</h3>
                <div class="events__description">
                    Explanation of what the workshop or talk is about. Lorem ipsum very long text
                    to fill the void and break the layout.
                </div>
                <div class="events__tags">
                    <span class="events__tag">Workshop</span>
                    <span class="events__tag">DevOps</span>
                    <span class="events__tag">Exoscale</span>
                </div>
            </div>
        </a>
        <a href="#" class="events__event">
            <time class="events__time">
                <span class="events__date">
                    <span class="events__datedetails">
                        <span class="events__day">22</span>
                        <span class="events__monthyear">
                            JUN 2020
                        </span>
                    </span>
                </span>
                <span class="events__hours">
                    09 PM &mdash; 10 PM
                </span>
            </time>
            <div class="events__details">
                <div class="events__location">Vienna</div>
                <h3>Workshop 1</h3>
                <div class="events__description">
                    Explanation of what the workshop or talk is about. Lorem ipsum very long text
                    to fill the void and break the layout.
                </div>
                <div class="events__tags">
                    <span class="events__tag">Workshop</span>
                    <span class="events__tag">DevOps</span>
                    <span class="events__tag">Exoscale</span>
                </div>
            </div>
        </a>
        <a href="#" class="events__event">
            <time class="events__time">
                <span class="events__date">
                    <span class="events__datedetails">
                        <span class="events__day">22</span>
                        <span class="events__monthyear">
                            JUN 2020
                        </span>
                    </span>
                </span>
                <span class="events__hours">
                    09 PM &mdash; 10 PM
                </span>
            </time>
            <div class="events__details">
                <div class="events__location">Vienna</div>
                <h3>Workshop 1</h3>
                <div class="events__description">
                    Explanation of what the workshop or talk is about. Lorem ipsum very long text
                    to fill the void and break the layout.
                </div>
                <div class="events__tags">
                    <span class="events__tag">Workshop</span>
                    <span class="events__tag">DevOps</span>
                    <span class="events__tag">Exoscale</span>
                </div>
            </div>
        </a>
    </div>
    <div id="after-events"></div>
</div>
{% endraw %}{% endcomment %}
