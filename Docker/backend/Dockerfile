# Build stage
FROM maven:3.8.7-eclipse-temurin-17 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-jammy
ARG PROFILE=dev
ARG APP_VERSION=1.0.0

# Install chaos engineering tools (tc for network latency, stress-ng for CPU/memory stress)
RUN apt-get update && \
    apt-get install -y --no-install-recommends iproute2 stress-ng && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=build /build/target/gestiondestock-*.jar /app/

# Extract the JAR version
RUN APP_VERSION=$(ls /app | grep *.jar | awk 'NR==2{split($0,a,"-"); print a[3]}' | awk '{sub(/.jar$/,"")}1')\
    && echo "Building container with BSN v-$version"
EXPOSE 8081


ENV DB_URL="jdbc:mysql://mysql:3306/gestion?createDatabaseIfNotExist=true&useSSL=false&useUnicode=true&allowPublicKeyRetrieval=true&serverTimezone=UTC"
ENV MAILDEV_URL=localhost

ENV ACTIVE_PROFILE=${PROFILE}
ENV JAR_VERSION=${APP_VERSION}

CMD java -jar -Dspring.profiles.active=${ACTIVE_PROFILE} -Dspring.datasource.url=${DB_URL} /app/gestiondestock-0.0.1-SNAPSHOT.jar
