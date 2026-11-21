#!/usr/bin/env python3
"""Script to update user passwords to bcrypt hashes."""

import os
import sys

# Add the project root to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlmodel import Session, select, create_engine
from app.models.user import User
from app.auth import hash_password

# Path to the database
db_path = os.path.join(os.path.dirname(__file__), 'donations.db')
engine = create_engine(f'sqlite:///{db_path}')

with Session(engine) as session:
    # Delete old users
    users = session.exec(select(User)).all()
    for u in users:
        session.delete(u)
    session.commit()
    print(f'Deleted {len(users)} old users')
    
    # Create new users with correct credentials
    users_to_create = [
        User(email='donante@alimenta.app', name='Donante Ejemplo', role='donante', password_hash=hash_password('donante123'), is_active=True),
        User(email='donante2@alimenta.app', name='Donante Ejemplo 2', role='donante', password_hash=hash_password('donante2123'), is_active=True),
        User(email='edil@alimenta.app', name='Edil Comunidad A', role='edil', password_hash=hash_password('edil123'), is_active=True),
        User(email='edil2@alimenta.app', name='Edil Comunidad B', role='edil', password_hash=hash_password('edil2123'), is_active=True),
        User(email='agente@alimenta.app', name='Agente Coordinador', role='agente', password_hash=hash_password('agente123'), is_active=True),
        User(email='admin@alimenta.app', name='Administradora', role='administrador', password_hash=hash_password('admin123'), is_active=True),
    ]
    
    for u in users_to_create:
        session.add(u)
        session.commit()
        print(f'Created user: {u.email}')
    
    session.commit()
    print('Done!')