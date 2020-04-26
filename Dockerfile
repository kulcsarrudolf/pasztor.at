FROM ubuntu:18.04 AS build
ENV NOKOGIRI_USE_SYSTEM_LIBRARIES=1
ENV JEYKLL_ENV=prod
ENV TZ="UTC"
ENV DEBIAN_FRONTEND="noninteractive"
RUN apt-get -o Dpkg::Options::="--force-confnew" -y update && \
    apt-get install -o Dpkg::Options::="--force-confnew" --force-yes -fuy \
        git build-essential libgsl-dev graphviz plantuml ruby ruby-dev ruby-fast-stemmer ruby-posix-spawn \
        ruby-rmagick libmagickwand-dev imagemagick nodejs npm python3-pip ca-certificates s3cmd && \
    npm install -g reveal-md
RUN mkdir -p /opt/src
WORKDIR /opt/src/
COPY Gemfile /opt/src/
COPY Gemfile.lock /opt/src/
RUN gem install bundler -v "$(grep -A 1 "BUNDLED WITH" Gemfile.lock | tail -n 1)"
RUN bundle install
COPY . /opt/src/
RUN bundle exec jekyll build --future --drafts --unpublished

FROM alpine:3.7 AS runtime
RUN apk upgrade --no-cache
RUN apk add --no-cache nginx curl
RUN mkdir -p /var/log/nginx \
    && chown -R nginx:nginx /var/log/nginx \
    && mkdir -p /run/nginx && \
    chown -R nginx:nginx /run/nginx
COPY .rootfs /
COPY --from=build /opt/src/_site/ /var/www/htdocs/
# TODO add user ID instead of name
USER nginx
EXPOSE 8080
HEALTHCHECK --interval=5s --timeout=5s --start-period=120s CMD curl --fail http://localhost:8080/ || exit 1
CMD ["/usr/sbin/nginx","-g","daemon off;"]
