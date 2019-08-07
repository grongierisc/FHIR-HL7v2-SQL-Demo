FROM docker.iscinternal.com/intersystems/irishealth:2019.2.0-latest
LABEL maintainer="Guillaume Rongier <guillaume.rongier@intersystems.com>"

RUN mkdir -p /home/irisowner/src &&\
 chown -R irisusr: /home/irisowner

COPY . /home/irisowner/src

WORKDIR /home/irisowner/src

COPY misc/iris.key /usr/irissys/mgr/iris.key

RUN /usr/irissys/dev/Cloud/ICM/changePassword.sh /home/irisowner/src/misc/password.txt &&\
 iris start IRIS && sh install.sh IRIS && iris stop IRIS quietly &&\
 rm /usr/irissys/mgr/iris.key
