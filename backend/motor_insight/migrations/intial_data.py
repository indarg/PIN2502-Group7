from django.db import migrations
from django.utils.timezone import now

from common.models.media_file import MediaFile
from motor_insight.models import News, Column
from user_management.models import User


def create_news(apps, schema_editor):
    """
    Create base permissions and user groups for the system, avoiding duplicates.
    """

    media_file = MediaFile.objects.create(title="news-1-column1.webp", description="Contenido de la noticia 1",file_url="/uploads/images/news-1-column1.webp", media_type="image", file_size=1000, file_format="image/webp")

    column1 = Column.objects.create(title="Equipo ganador", body="PHA+TGEgTmF0aXZpZGFkIC0gTGEgRG9sZmluYSBlc3TDoSBjb25mb3JtYWRhIHBvciBDYW1pbG8gIkpldGEiIENhc3RhZ25vbGEsIEFkb2xmbyAiUG9yb3RvIiBDYW1iaWFzbyAobiksIEFkb2xmbyBDYW1iaWFzbyAoaCkgeSBCYXJ0b2xvbcOpIENhc3RhZ25vbGEgKGgpLiBQYWRyZSwgaGlqbyB5IHNvYnJpbm9zIHNlIGp1bnRhcm9uIGVuIGVzdGUgc2Vuc2FjaW9uYWwgZXF1aXBvIGRlIGN1YXJlbnRhIGdvbGVzIGRlIGhhbmRpY2FwLCBxdWUgeWEgc2UgY29uc2FncsOzIGNhbXBlw7NuIGRlbCBBYmllcnRvIGRlIEh1cmxpbmdoYW0sIGVsIHByaW1lciBjYW1wZW9uYXRvIGRlIGxhIFRyaXBsZSBDb3JvbmEuIENvbiB1bmEgZGVzdGFjYWRhIHBlcmZvcm1hbmNlIGVuIFRvcnR1Z2FzLCBxdWUgeWEgbG9zIHB1c28gZW4gbGEgZmluYWwsIHkgZGUgY2FyYSBhbCBBYmllcnRvIGRlIFBhbGVybW8sIGVzdGEgdGVtcG9yYWRhIHNlIHBlcmZpbGFuIGNvbW8gZWwgZXF1aXBvIHF1ZSBzZSBxdWVkYXLDoSBjb24gbG9zIHRyZXMgdHJvZmVvcy48L3A+",image_id=media_file.id)
    media_file = MediaFile.objects.create(title="news-1-column2.webp", description="Contenido de la noticia 1",file_url="/uploads/images/news-1-column2.webp", media_type="image", file_size=1000, file_format="image/webp")

    column2 = Column.objects.create(title="El apoyo de Ram", body="PHA+UmFtIGRlc3RhY2EgbGEgcG90ZW5jaWEsIHByZWNpc2nDs24geSBsaWRlcmF6Z28gcXVlIGVsIGVxdWlwbyBkZW11ZXN0cmEgZW4gY2FkYSBjaHVra2VyLCB5IHNvbiBsb3MgdmFsb3JlcyBxdWUgY29uc2lkZXJhbiBxdWUgdGFtYmnDqW4gZGlzdGluZ3VlbiBhIGxhIG1hcmNhLiBFcyBwb3IgZXN0byBxdWUgZGVjaWRlbiBhY29tcGHDsWFybG9zIGVuIGVzdGEgdGVtcG9yYWRhLCB5IGNhZGEganVnYWRvciBjb25kdWNlIHVuYSAxNTAwIHBsb3RlYWRhIGRlIGF6dWwsIGNvbiBsb3MgbG9nb3MgZGUgTGEgTmF0aXZpZGFkIC0gTGEgRG9sZmluYS4gRXN0ZSBtb2RlbG8gcGVydGVuZWNlIGFsIHNlZ21lbnRvIGZ1bGwgc2l6ZSwgeSBlc3TDoSBlcXVpcGFkYSBjb24gZWwgbW90b3IgSHVycmljYW5lIDMuMEwgYml0dXJibyAoNDI2IENWIC8gNjM1IE5tKSwgdHJhY2Npw7NuIDR4NCB5IHVuYSBjYXBhY2lkYWQgZGUgdGlybyBkZSA0LjQ5MiBLZywgaWRlYWwgcGFyYSBsbGV2YXIgdW4gdHJhaWxlciBjb24gY2FiYWxsb3MgZGUgcG9sby4gRW50cmUgc3UgZXF1aXBhbWllbnRvIHNlIGRlc3RhY2FuIGxhcyBwYW50YWxsYXMgZGlnaXRhbGVzIHkgbGFzIGFzaXN0ZW5jaWFzIGF2YW56YWRhcyBhIGxhIGNvbmR1Y2Npw7NuLiBIb3kgbG9zIGNsaWVudGVzIHB1ZWRlbiBhZHF1aXJpciBlc3RlIHZlaMOtY3VsbyBwb3IgdW4gcHJlY2lvIGRlIFUkRCAxMDEuODAwLCBlbiB2ZXJzaW9uZXMgTGFyYW1pZSB5IE5pZ2h0IEVkaXRpb24uPC9wPg==",image_id=media_file.id)

    columns = [column1,column2]
    media_file = MediaFile.objects.create(title="news-1-mainimage", description="Contenido de la noticia 1",file_url="/uploads/images/news-1-mainimage.webp", media_type="image", file_size=1000, file_format="image/webp")
    user = User.objects.get(username="admin1")
    news = News.objects.create(headline="Ram acompaña a La Natividad - La Dolfina.",
                               created_by_id=user.id,
                               created_at=now(),lead="PHA+TGEgbWFyY2EgZGUgU3RlbGxhbnRpcyBlc3BlY2lhbGl6YWRhIGVuIHBpY2stdXBzIGFjb21wYcOxYSBhbCBlcXVpcG8gZGUgNDAgZ29sZXMgZW4gbGEgVHJpcGxlIENvcm9uYSAyMDI1LjwvcD4=",body="PGg1PlJhbSBzZSBjb252aXJ0acOzIGVuIHBhdHJvY2luYW50ZSBkZWwgZmxhbWFudGUgZXF1aXBvIGRlIHBvbG8gcGFyYSBlc3RhIHRlbXBvcmFkYSAyMDI1LCBxdWUgc3VyZ2nDsyBkZSBsYSBmdXNpw7NuIGVudHJlIExhIERvbGZpbmEsIGRlIEFkb2xmbyBDYW1iaWFzbywgeSBMYSBOYXRpdmlkYWQsIGRlIExvbG8gQ2FzdGFnbm9sYS4gU3VzIGN1YXRybyDDrW50ZWdyYW50ZXMsIGNhZGEgdW5vIGNvbiBkaWV6IGdvbGVzIGRlIGhhbmRpY2FwLCBjb25kdWNlbiB1bmEgUmFtIDE1MDAgcGxvdGVhZGEgZGUgY29sb3IgYXp1bCwgY29uIGxvcyBsb2dvcyBkZSBhbWJvcyBjbHViZXMuPC9oNT4",published=True,main_image_id=media_file.id )
    news.columns.set(columns)







def reverse_news(apps, schema_editor):
    """
    Remove created permissions and groups if the migration is rolled back.
    """
    News.objects.all().delete()
    Column.objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ("user_management", "initial_data"),
        ("motor_insight", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_news, reverse_news),
    ]
