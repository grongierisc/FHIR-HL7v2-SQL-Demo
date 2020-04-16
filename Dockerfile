ARG IMAGE=store/intersystems/irishealth-community:2020.2.0.196.0

FROM $IMAGE
LABEL maintainer="Guillaume Rongier <guillaume.rongier@intersystems.com>"

RUN echo "password" > /tmp/password.txt && /usr/irissys/dev/Container/changePassword.sh /tmp/password.txt

#COPY misc/iris.key /usr/irissys/mgr/iris.key

COPY . /tmp/src

WORKDIR /tmp/src

RUN iris start $ISC_PACKAGE_INSTANCENAME EmergencyId=sys,sys && \
 sh install.sh $ISC_PACKAGE_INSTANCENAME && \
 /bin/echo -e "sys\nsys\n" | iris stop $ISC_PACKAGE_INSTANCENAME quietly 

WORKDIR /home/irisowner/