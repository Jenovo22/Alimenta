#!/usr/bin/env python3
"""Seed script for donations database with synthetic donation data."""

import json
from datetime import datetime, timedelta, timezone
from sqlmodel import Session, SQLModel, create_engine, text
from ..auth import hash_password
from ..models import (
    User, Community, ProductCategory, Product, Donation,
    VolunteerEvent, AvailabilityWindow, Inventory, Organization,
    EdilCommunityLink, Need
)


# Demo credentials (these will be shown to users)
DEMO_CREDENTIALS = {
    "donante": {"email": "donante@alimenta.app", "password": "donante123"},
    "edil": {"email": "edil@alimenta.app", "password": "edil123"},
    "agente": {"email": "agente@alimenta.app", "password": "agente123"},
    "administrador": {"email": "admin@alimenta.app", "password": "admin123"},
}


def now_utc():
    """Get current UTC time with timezone info."""
    return datetime.now(timezone.utc)


def create_demo_users() -> list[User]:
    """Create synthetic demo users with proper password hashes."""
    now = now_utc()
    return [
        User(
            id=1, email=DEMO_CREDENTIALS["donante"]["email"],
            name="Donante Ejemplo", role="donante",
            password_hash=hash_password(DEMO_CREDENTIALS["donante"]["password"]),
            is_active=True, created_at=now, updated_at=now
        ),
        User(
            id=2, email="donante2@alimenta.app",
            name="Donante Ejemplo 2", role="donante",
            password_hash=hash_password("donante2123"),
            is_active=True, created_at=now, updated_at=now
        ),
        User(
            id=3, email=DEMO_CREDENTIALS["edil"]["email"],
            name="Edil Comunidad", role="edil",
            password_hash=hash_password(DEMO_CREDENTIALS["edil"]["password"]),
            is_active=True, created_at=now, updated_at=now
        ),
        User(
            id=4, email="edil2@alimenta.app",
            name="Edil Comunidad B", role="edil",
            password_hash=hash_password("edil2123"),
            is_active=True, created_at=now, updated_at=now
        ),
        User(
            id=5, email=DEMO_CREDENTIALS["agente"]["email"],
            name="Agente Coordinador", role="agente",
            password_hash=hash_password(DEMO_CREDENTIALS["agente"]["password"]),
            is_active=True, created_at=now, updated_at=now
        ),
        User(
            id=6, email=DEMO_CREDENTIALS["administrador"]["email"],
            name="Administradora", role="administrador",
            password_hash=hash_password(DEMO_CREDENTIALS["administrador"]["password"]),
            is_active=True, created_at=now, updated_at=now
        ),
    ]


def create_demo_communities() -> list[Community]:
    """Create synthetic communities."""
    now = now_utc()
    return [
        Community(id=1, name="Comunidad Manrique", description="Barrio Manrique - zona norte de Manizales", code="MAN-MR", is_verified=True, created_at=now, updated_at=now),
        Community(id=2, name="Comunidad Laureles", description="Barrio Laureles - zona centro de Manizales", code="MAN-LR", is_verified=True, created_at=now, updated_at=now),
        Community(id=3, name="Comunidad Lleras", description="Barrio Lleras - zona sur de Manizales", code="MAN-LL", is_verified=True, created_at=now, updated_at=now),
    ]


def create_demo_edil_links() -> list[EdilCommunityLink]:
    """Create edil-community links."""
    return [
        EdilCommunityLink(edil_id=3, community_id=1, created_at=now_utc()),
        EdilCommunityLink(edil_id=4, community_id=2, created_at=now_utc()),
    ]


def create_demo_product_categories() -> list[ProductCategory]:
    """Create synthetic product categories."""
    return [
        ProductCategory(id=1, name="Alimentos No Perecederos", description="Arroz, pasta, legumbres, etc.", is_active=True, sort_order=1),
        ProductCategory(id=2, name="Alimentos Perecederos", description="Frutas, verduras, productos frescos", is_active=True, sort_order=2),
        ProductCategory(id=3, name="Higiene Personal", description="Artículos de higiene personal", is_active=True, sort_order=3),
        ProductCategory(id=4, name="Artículos de Casa", description="Utensilios, limpieza, etc.", is_active=True, sort_order=4),
    ]


def create_demo_products(categories: list[ProductCategory]) -> list[Product]:
    """Create synthetic products."""
    return [
        Product(id=1, category_id=1, name="Arroz", description="Arroz de grano corto", unit="kg", is_perishable=False, is_active=True, sort_order=1),
        Product(id=2, category_id=1, name="Legumbres", description="Frijoles, lentejas, etc.", unit="kg", is_perishable=False, is_active=True, sort_order=2),
        Product(id=3, category_id=2, name="Frutas", description="Frutas de temporada", unit="kg", is_perishable=True, is_active=True, sort_order=1),
        Product(id=4, category_id=3, name="Jabón", description="Jabón líquido o en barra", unit="unidad", is_perishable=False, is_active=True, sort_order=1),
        Product(id=5, category_id=4, name="Pañales", description="Pañales de bebé", unit="paquete", is_perishable=False, is_active=True, sort_order=1),
    ]


def create_demo_organizations() -> list[Organization]:
    """Create synthetic allied organizations."""
    return [
        Organization(id=1, name="Cooperativa Comunitaria Manrique", description="Organización vecinal referida", logo_url="https://via.placeholder.com/100", website_url="https://ejemplo.com", rank_position=1, is_verified=True),
        Organization(id=2, name="Asociación de Beneficencia Laureles", description="Entidad histórica de la región", logo_url="https://via.placeholder.com/100", website_url="https://ejemplo.com", rank_position=2, is_verified=True),
        Organization(id=3, name="Fundación Joven con Propósito", description="Organización juvenil de la región", logo_url="https://via.placeholder.com/100", website_url="https://ejemplo.com", rank_position=3, is_verified=True),
        Organization(id=4, name="Casa de la Mujer Manizales", description="Organización feminista local", logo_url="https://via.placeholder.com/100", website_url="https://ejemplo.com", rank_position=4, is_verified=True),
        Organization(id=5, name="Red de Apoyo Comunitario", description="Red de apoyo vecinal", logo_url="https://via.placeholder.com/100", website_url="https://ejemplo.com", rank_position=5, is_verified=True),
        Organization(id=6, name="Cooperativa Comercial El Río", description="Negocio local comprometido", logo_url="https://via.placeholder.com/100", website_url="https://ejemplo.com", rank_position=6, is_verified=True),
        Organization(id=7, name="Escritorio de la Juventud", description="Programa municipal de jóvenes", logo_url="https://via.placeholder.com/100", website_url="https://ejemplo.com", rank_position=7, is_verified=True),
        Organization(id=8, name="Casa de la Cultura Manizales", description="Espacio cultural comunitario", logo_url="https://via.placeholder.com/100", website_url="https://ejemplo.com", rank_position=8, is_verified=True),
        Organization(id=9, name="Comedor Vecinal San Javier", description="Punto de alimentación comunitario", logo_url="https://via.placeholder.com/100", website_url="https://ejemplo.com", rank_position=9, is_verified=True),
        Organization(id=10, name="Guardería Infantil Manizales", description="Cuidado Infantil en el Hogar", logo_url="https://via.placeholder.com/100", website_url="https://ejemplo.com", rank_position=10, is_verified=True),
    ]


def create_demo_availability_windows(users: list[User], communities: list[Community]) -> list[AvailabilityWindow]:
    """Create synthetic availability windows."""
    now = now_utc()
    windows = []

    # Edil windows for receiving donations (2 ediles: indices 2 and 3)
    for i in range(2):
        windows.append(AvailabilityWindow(
            id=i+1,
            owner_id=users[i + 2].id,  # Edil users at index 2, 3
            owner_type="EDIL",
            community_id=communities[i].id,
            start_datetime=now + timedelta(days=1, hours=9),
            end_datetime=now + timedelta(days=1, hours=11),
            duration_minutes=120,
            capacity=5,
            status="ACTIVE",
            slot_label="Mañana",
            created_at=now,
            updated_at=now
        ))

    # Bank windows for receiving donations
    for i in range(2):
        windows.append(AvailabilityWindow(
            id=i+3,
            owner_id=users[4].id,  # Agente user as bank owner
            owner_type="BANCO",
            community_id=communities[i % 3].id,
            start_datetime=now + timedelta(days=2, hours=14),
            end_datetime=now + timedelta(days=2, hours=16),
            duration_minutes=120,
            capacity=10,
            status="ACTIVE",
            slot_label="Tarde",
            created_at=now,
            updated_at=now
        ))

    return windows


def create_demo_donations(users: list[User], products: list[Product]) -> list[Donation]:
    """Create synthetic donations with various statuses."""
    now = now_utc()

    donations = [
        # Pending donations from donantes
        Donation(
            id=1,
            donor_id=1,
            edil_id=3,
            product_id=1,  # Arroz
            quantity=5,
            modality="DIRIGIDA_EDIL",
            status="Ofrecida",
            appointment_status="Pendiente de aceptación",
            transport_status="Pendiente",
            receipt_status="Pendiente",
            created_at=now - timedelta(days=1),
            updated_at=now - timedelta(days=1)
        ),
        Donation(
            id=2,
            donor_id=2,
            edil_id=3,
            product_id=3,  # Frutas
            quantity=3,
            modality="DIRIGIDA_EDIL",
            status="Ofrecida",
            appointment_status="Pendiente de aceptación",
            transport_status="Pendiente",
            receipt_status="Pendiente",
            created_at=now - timedelta(days=2),
            updated_at=now - timedelta(days=2)
        ),
        # Accepted donations
        Donation(
            id=3,
            donor_id=1,
            edil_id=3,
            product_id=1,  # Arroz
            quantity=4,
            modality="DIRECTA",
            status="Ofrecida",
            appointment_status="Aceptada",
            transport_status="Pendiente",
            receipt_status="Pendiente",
            created_at=now - timedelta(days=3),
            updated_at=now - timedelta(days=3)
        ),
        # Accepted and transportation started
        Donation(
            id=4,
            donor_id=2,
            edil_id=4,
            product_id=4,  # Jabón
            quantity=10,
            modality="BANCO",
            status="Ofrecida",
            appointment_status="Aceptada",
            transport_status="En transporte",
            receipt_status="Pendiente",
            created_at=now - timedelta(days=1),
            updated_at=now - timedelta(hours=12)
        ),
        # Confirmed receipt
        Donation(
            id=5,
            donor_id=1,
            edil_id=4,
            product_id=5,  # Pañales
            quantity=2,
            modality="DIRIGIDA_EDIL",
            status="Ofrecida",
            appointment_status="Aceptada",
            transport_status="En transporte",
            receipt_status="Confirmada",
            created_at=now - timedelta(days=5),
            updated_at=now - timedelta(hours=6)
        ),
        # Rejected donation
        Donation(
            id=6,
            donor_id=2,
            edil_id=3,
            product_id=1,  # Arroz
            quantity=2,
            modality="DIRECTA",
            status="Rechazada",
            appointment_status="Rechazada",
            transport_status="Pendiente",
            receipt_status="Pendiente",
            created_at=now - timedelta(days=2),
            updated_at=now - timedelta(days=2)
        ),
    ]

    return donations


def create_demo_volunteer_events(users: list[User]) -> list[VolunteerEvent]:
    """Create synthetic volunteer events."""
    now = now_utc()

    return [
        VolunteerEvent(
            id=1,
            account_id=users[2].id,  # Edil 1
            event_type="Jornada de vacunación",
            volunteer_name="Dr. Carlos Gómez",
            venue="Centro Comunitario San Javier",
            date=now + timedelta(days=10),
            start_time="08:00",
            end_time="11:00",
            status="Pendiente de revisión",
            created_at=now - timedelta(days=3),
            updated_at=now - timedelta(days=3)
        ),
        VolunteerEvent(
            id=2,
            account_id=users[3].id,  # Edil 2
            event_type="Atención psicológica",
            volunteer_name="Lic. María Fernández",
            venue="Salón Público La Playa",
            date=now + timedelta(days=15),
            start_time="14:00",
            end_time="16:00",
            status="Pendiente de revisión",
            created_at=now - timedelta(days=5),
            updated_at=now - timedelta(days=5)
        ),
        VolunteerEvent(
            id=3,
            account_id=users[2].id,  # Edil 1
            event_type="Atención médica básica",
            volunteer_name="Dr. Ana López",
            venue="Casa de la Cultura Manizales",
            date=now + timedelta(days=20),
            start_time="09:00",
            end_time="12:00",
            status="Publicada",  # Already approved
            created_at=now - timedelta(days=10),
            updated_at=now - timedelta(days=8)
        ),
    ]


def create_demo_inventory(products: list[Product]) -> list[Inventory]:
    """Create synthetic inventory items."""
    now = now_utc()
    return [
        Inventory(
            id=1,
            product_id=products[0].id,  # Arroz
            received_quantity=25,
            available_quantity=15,
            reserved_quantity=5,
            dispatched_quantity=5,
            location="Pallet 1",
            last_received_at=now - timedelta(days=2),
            created_at=now - timedelta(days=10),
            updated_at=now
        ),
        Inventory(
            id=2,
            product_id=products[3].id,  # Jabón
            received_quantity=50,
            available_quantity=40,
            reserved_quantity=0,
            dispatched_quantity=10,
            location="Estante A",
            last_received_at=now - timedelta(days=1),
            created_at=now - timedelta(days=15),
            updated_at=now
        ),
        Inventory(
            id=3,
            product_id=products[4].id,  # Pañales
            received_quantity=20,
            available_quantity=10,
            reserved_quantity=5,
            dispatched_quantity=5,
            location="Pallet 2",
            last_received_at=now - timedelta(days=3),
            created_at=now - timedelta(days=20),
            updated_at=now
        ),
    ]


def create_demo_needs(users: list[User], communities: list[Community], products: list[Product]) -> list[Need]:
    """Create synthetic needs for communities."""
    now = now_utc()

    return [
        Need(
            id=1,
            edil_id=users[2].id,  # Edil 1
            community_id=communities[0].id,  # Comunidad Manrique
            product_id=products[0].id,  # Arroz
            quantity=10,
            description="Necesitamos arroz para familias vulnerables",
            status="Publicada",
            is_satisfied=False,
            created_at=now - timedelta(days=1),
            updated_at=now - timedelta(days=1)
        ),
        Need(
            id=2,
            edil_id=users[3].id,  # Edil 2
            community_id=communities[1].id,  # Comunidad Laureles
            product_id=products[2].id,  # Frutas
            quantity=15,
            description="Solicitud de frutas de temporada para niños en escuela",
            status="Publicada",
            is_satisfied=False,
            created_at=now - timedelta(days=3),
            updated_at=now - timedelta(days=3)
        ),
        Need(
            id=3,
            edil_id=users[2].id,  # Edil 1
            community_id=communities[0].id,  # Comunidad Manrique
            product_id=products[3].id,  # Jabón
            quantity=20,
            description="Para distribuir en centro de salud comunitario",
            status="Satisfecha",  # Already satisfied
            is_satisfied=True,
            created_at=now - timedelta(days=10),
            updated_at=now - timedelta(days=5)
        ),
    ]


def seed_database(db_url: str = "sqlite:///./donations.db"):
    """Seed the database with synthetic data."""
    engine = create_engine(db_url)

    # Create all tables
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        # Create and add users
        users = create_demo_users()
        for user in users:
            session.add(user)
        session.commit()
        for user in users:
            session.refresh(user)

        # Create and add communities
        communities = create_demo_communities()
        for com in communities:
            session.add(com)
        session.commit()
        for com in communities:
            session.refresh(com)

        # Create edil-community links
        edil_links = create_demo_edil_links()
        for link in edil_links:
            session.add(link)
        session.commit()

        # Create product categories
        categories = create_demo_product_categories()
        for cat in categories:
            session.add(cat)
        session.commit()
        for cat in categories:
            session.refresh(cat)

        # Create products
        products = create_demo_products(categories)
        for prod in products:
            # Use the first category for simplicity
            prod.category_id = 1
            session.add(prod)
        session.commit()
        for prod in products:
            session.refresh(prod)

        # Create organizations
        organizations = create_demo_organizations()
        for org in organizations:
            session.add(org)
        session.commit()

        # Create availability windows
        windows = create_demo_availability_windows(users, communities)
        for win in windows:
            session.add(win)
        session.commit()

        # Create volunteer events
        events = create_demo_volunteer_events(users)
        for ev in events:
            session.add(ev)
        session.commit()

        # Create donations
        donations = create_demo_donations(users, products)
        for don in donations:
            session.add(don)
        session.commit()

        # Create inventory
        inventory_items = create_demo_inventory(products)
        for inv in inventory_items:
            session.add(inv)
        session.commit()

        # Create needs
        needs = create_demo_needs(users, communities, products)
        for need in needs:
            session.add(need)
        session.commit()

        print(f"Database seeded successfully!")
        print(f"Created: {len(users)} usuarios, {len(communities)} comunidades, {len(categories)} categorías")
        print(f"         {len(products)} productos, {len(organizations)} organizaciones, {len(windows)} ventanas")
        print(f"         {len(events)} jornadas, {len(donations)} donaciones, {len(inventory_items)} ítems de inventario")
        print(f"         {len(needs)} necesidades")

        return True


if __name__ == "__main__":
    seed_database()