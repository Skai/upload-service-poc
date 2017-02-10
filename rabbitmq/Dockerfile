FROM rabbitmq:latest

RUN apt-get update && \
    apt-get install --assume-yes netcat && \
    rabbitmq-plugins enable rabbitmq_stomp && \
    rabbitmq-plugins enable --offline rabbitmq_management