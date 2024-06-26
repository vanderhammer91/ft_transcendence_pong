"""
Django settings for my_django_backend project.

Generated by 'django-admin startproject' using Django 3.2.12.
For more information on this file, see https://docs.djangoproject.com/en/3.2/topics/settings/
For the full list of settings and their values, see https://docs.djangoproject.com/en/3.2/ref/settings/
"""

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/
SECRET_KEY = 'django-insecure-ip@5co))1*=!h2u*%_hf95)w^rgy0)7_t7(knfgc$zbje0*+%p'
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '10.0.2.15']  # Add your production domain when ready

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'channels',
    'corsheaders',  # Ensure this is added to handle CORS
    'game',  # Your custom app
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Ensure CORS headers are handled
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'my_django_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'my_django_backend.wsgi.application'
ASGI_APPLICATION = 'my_django_backend.asgi.application'  # Correct the module path

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [...]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

STATIC_URL = '/static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels_redis.core.RedisChannelLayer',
        'CONFIG': {
            'hosts': [('127.0.0.1', 6380)],
        },
    },
}

# Allow all CORS for development, change in production
CORS_ALLOW_ALL_ORIGINS = True  # For development, set this to False and use CORS_ALLOWED_ORIGINS for production
