FROM docker.iscinternal.com/intersystems/irishealth:2019.2.0-latest
LABEL maintainer="Guillaume Rongier <guillaume.rongier@intersystems.com>"

RUN mkdir -p /home/irisowner/src

COPY . /home/irisowner/src

WORKDIR /home/irisowner/src

COPY misc/iris.key /usr/irissys/mgr/iris.key

RUN /usr/irissys/dev/Cloud/ICM/changePassword.sh /home/irisowner/src/misc/password.txt

RUN iris start IRIS && sh install.sh IRIS

RUN rm /usr/irissys/mgr/iris.key
