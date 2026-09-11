FROM postgres:16-bookworm

COPY postgresql.conf pg_hba.conf /etc/postgresql/
COPY start.sh /usr/local/bin/start-postgres
RUN chmod +x /usr/local/bin/start-postgres

ENTRYPOINT ["start-postgres"]
CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]
