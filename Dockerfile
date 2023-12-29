FROM node:latest

RUN apt-get update && apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    unzip \
    zip \
    sudo 

RUN curl https://packages.cloud.google.com/apt/doc/apt-key.gpg |  gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg

# RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg && apt-get update -y && apt-get install google-cloud-sdk -y
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg  add - && apt-get update -y && apt-get install google-cloud-sdk -y

ENV PROJECT_ID=$PROJECT_ID

COPY ./auth/auth.json /root/.config/gcloud/application_default_credentials.json

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose port 3000
EXPOSE 3000

# Run the app
CMD [ "npm", "start" ]
