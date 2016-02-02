FROM google/nodejs:0.10.33
ENV token=BOT_API_TOKEN
RUN mkdir /dist
ADD . /dist
VOLUME /dist
RUN cd /dist && npm install --production
CMD token=${token} node /dist/src/index.js
