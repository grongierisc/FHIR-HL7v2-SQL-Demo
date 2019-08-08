FROM docker.iscinternal.com/intersystems/irishealth:2019.2.0-latest
LABEL maintainer="Guillaume Rongier <guillaume.rongier@intersystems.com>"
ENV IRIS_INSTANCE_NAME="IRIS" \
 IRIS_LICENSE_FILENAME="iris.key" \
 IRIS_OWNER="irisowner" \
 PASSWORD_FILENAME="password.txt"
RUN mkdir -p /home/$IRIS_OWNER/src &&\
 chown -R irisusr: /home/$IRIS_OWNER

COPY . /home/$IRIS_OWNER/src

WORKDIR /home/$IRIS_OWNER/src

COPY misc/$IRIS_LICENSE_FILENAME /usr/irissys/mgr/$IRIS_LICENSE_FILENAME

RUN /usr/irissys/dev/Cloud/ICM/changePassword.sh /home/$IRIS_OWNER/src/misc/$PASSWORD_FILENAME &&\
 iris start $IRIS_INSTANCE_NAME && \
 sh install.sh $IRIS_INSTANCE_NAME && \
 iris stop $IRIS_INSTANCE_NAME quietly &&\
 rm /usr/irissys/mgr/$IRIS_LICENSE_FILENAME
