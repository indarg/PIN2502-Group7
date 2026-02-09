# Use Python 3.12.4 slim image for better compatibility
FROM python:3.12.4-slim

# Define environment variables
ENV APP_PATH=/opt/web
ENV STATIC_FOLDER_PATH=$APP_PATH/app/static
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Create the application directory and set the working directory
RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

# Install system dependencies needed for PostgreSQL and other packages
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    postgresql-client \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file first to leverage Docker's cache
COPY ./requirements.txt .

# Upgrade pip and install application dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy all source code into the image
COPY . .

# Expose the application port
EXPOSE 8000

CMD ["gunicorn", "app.wsgi:application", "--bind", "0.0.0.0:8000"]