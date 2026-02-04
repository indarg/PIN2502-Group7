from django.db import migrations
from django.contrib.auth.models import Permission, Group
from django.contrib.contenttypes.models import ContentType

from user_management.utils.hash_utils import generate_hash


def create_permissions_and_groups(apps, schema_editor):
    """
    Create base permissions and user groups for the system, avoiding duplicates.
    """
    User = apps.get_model("user_management", "User")
    MediaFile = apps.get_model("common", "MediaFile")

    content_types = {
        "user_management": ContentType.objects.get_for_model(User),
        "common": ContentType.objects.get_for_model(MediaFile),
    }

    permissions = [
        ("add_user", "Can add user", "user_management"),
        ("change_user", "Can change user", "user_management"),
        ("delete_user", "Can delete user", "user_management"),
        ("view_user", "Can view user", "user_management"),

        ("add_group", "Can add group", "auth"),
        ("change_group", "Can change group", "auth"),
        ("delete_group", "Can delete group", "auth"),
        ("view_group", "Can view group", "auth"),

        ("add_post", "Can add post", "common"),
        ("change_post", "Can change post", "common"),
        ("delete_post", "Can delete post", "common"),
        ("view_post", "Can view post", "common"),
    ]

    permission_objects = {}
    for codename, name, app_label in permissions:
        content_type = content_types.get(app_label, None)
        if content_type:
            perm, created = Permission.objects.get_or_create(
                codename=codename,
                content_type=content_type,
                defaults={"name": name}
            )
            permission_objects[codename] = perm
            if created:
                print(f"Permission '{codename}' created.")
            else:
                print(f"Permission '{codename}' already exists.")

    groups = {
        "Admin": ["add_user", "change_user", "delete_user", "view_user", "add_group", "change_group", "delete_group",
                  "view_group"],
        "Manager": ["add_user", "change_user", "view_user", "view_group"],
        "Viewer": ["view_user", "view_group", "view_post"],
    }

    for group_name, perms in groups.items():
        group, created = Group.objects.get_or_create(name=group_name)
        if created:
            print(f"Group '{group_name}' created.")
        for perm in perms:
            if perm in permission_objects:
                group.permissions.add(permission_objects[perm])
        group.save()


def reverse_permissions_and_groups(apps, schema_editor):
    """
    Remove created permissions and groups if the migration is rolled back.
    """
    Group.objects.filter(name__in=["Admin", "Manager", "Viewer"]).delete()
    Permission.objects.filter(codename__in=[
        "add_user", "change_user", "delete_user", "view_user",
        "add_group", "change_group", "delete_group", "view_group",
        "add_post", "change_post", "delete_post", "view_post",
    ]).delete()


def reverse_admins(apps, schema_editor):
    """
    Remove created permissions and groups if the migration is rolled back.
    """
    from django.contrib.auth import get_user_model
    User = get_user_model()
    User.objects.all().delete()


def create_admin_users(apps, schema_editor):
    from django.contrib.auth import get_user_model
    from django.contrib.auth.models import Group

    generate_hash()
    #
    User = get_user_model()
    admin_group, _ = Group.objects.get_or_create(name="Admin")
    #
    users_data = [
        {"username": "admin1", "email": "assefhluciano@gmail.com", "first_name": "Luciano", "last_name": "Assefh"},
        {"username": "admin2", "email": "admin2@example.com", "first_name": "Franco", "last_name": ""},
    ]
    for user_data in users_data:
        user, created = User.objects.get_or_create(username=user_data["username"], defaults={
            "email": user_data["email"],
            "first_name":user_data["first_name"],
            "last_name": user_data["last_name"],
            "is_staff": True,
            "is_superuser": True
        })
        if created:
            user.set_password("adminpassword")
            user.groups.add(admin_group)
            user.save()
            print(f"User '{user.username}' created and added to 'Admin' group.")
        else:
            print(f"User '{user.username}' already exists.")
    print("User creation process completed.")

class Migration(migrations.Migration):
    dependencies = [
        ("user_management", "0002_usertoken_date_limit"),
    ]

    operations = [
        migrations.RunPython(create_permissions_and_groups, reverse_permissions_and_groups),
        migrations.RunPython(create_admin_users, reverse_admins),
    ]
