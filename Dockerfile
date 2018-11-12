FROM node:8


WORKDIR /home/app


# Install Dependencies
ADD package.json /home/app/package.json

RUN npm install
RUN cd client && npm install



# Make everything available for start
COPY . /home/app

# Install
RUN npm run build
RUN cd client && npm run build

# Set development environment as default
ENV NODE_ENV production
ENV PORT 80

EXPOSE 80
CMD ["npm", "start"]