FROM centos:centos6

# Enable EPEL for Node.js
RUN rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm

# Install Node...
RUN yum install -y npm

# directory to run the app from in the image
RUN mkdir -p /usr/src/inverted-index

# install the packages
COPY package.json /usr/src/inverted-index
RUN cd /usr/src/inverted-index && npm install

# the app uses gulp to run hence install gulp
RUN npm install -g gulp

# move inverted index code to the /usr/src directory -- bundle the app code
COPY . /usr/src/inverted-index

# Your app binds to port 8080 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000

# run the app
CMD cd /usr/src/inverted-index && gulp