FROM ubuntu:20.04

RUN apt update

RUN apt install -y python3

RUN apt install tzdata

RUN apt install -y nodejs npm nginx