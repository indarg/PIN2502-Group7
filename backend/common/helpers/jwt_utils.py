import datetime
import os
from datetime import timedelta

import jwt


def generate_jwt_crm(user):
    payload = {
        "sub": user.id,
        "email": user.email,
        "roles": [group.name for group in user.groups.all()],
        "type": "admin",
        "iat": datetime.datetime.utcnow(),
        "exp": datetime.datetime.utcnow() + timedelta(hours=12)
    }
    return jwt.encode(payload, os.getenv('JWT_CRM_SECRET'), algorithm="HS256")
