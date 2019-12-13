ARG IMAGE=docker.iscinternal.com/intersystems/irishealth:2019.2.0-latest
ARG IMAGE=store/intersystems/irishealth-community:2019.4.0.379.0

FROM $IMAGE
LABEL maintainer="Guillaume Rongier <guillaume.rongier@intersystems.com>"

RUN echo "password" > /tmp/password.txt && /usr/irissys/dev/Container/changePassword.sh /tmp/password.txt

ARG IRIS_OWNER=irisowner
COPY . /home/$IRIS_OWNER/src

WORKDIR /home/$IRIS_OWNER/src

RUN iris start $ISC_PACKAGE_INSTANCENAME && \
 sh install.sh $ISC_PACKAGE_INSTANCENAME && \
 iris stop $ISC_PACKAGE_INSTANCENAME quietly 

WORKDIR /home/irisowner/