# Use official SRS image (v5 stable)
FROM ossrs/srs:5

# Expose SRS ports
EXPOSE 1935 1985 8080 1990 8088 8000/udp

# Start SRS with default Docker config
CMD ["./objs/srs", "-c", "conf/docker.conf"]
