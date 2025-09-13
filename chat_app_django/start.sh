#!/bin/bash

# Step 1: Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Step 2: Run migrations
echo "Running migrations..."
python manage.py migrate

# Step 3: Create admin user if not exists
echo "Checking for admin user..."
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username="admin").exists():
    User.objects.create_superuser(
        username="admin",
        password="admin123",  # change this to your desired password
        email="admin@example.com"
    )
    print("Admin user created.")
else:
    print("Admin user already exists.")
EOF

# Step 4: Start server
echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000
