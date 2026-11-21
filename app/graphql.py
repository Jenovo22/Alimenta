import os
import strawberry
from typing import List

# Simple type definitions – adjust fields to match your actual data models
@strawberry.type
class CatalogItem:
    id: int
    name: str
    description: str = ""

@strawberry.type
class NeedItem:
    id: int
    title: str
    fulfilled: bool = False

@strawberry.type
class AppointmentItem:
    id: int
    datetime: str
    client_name: str = ""

# Placeholder data – replace with real data fetching logic
def get_catalog_items() -> List[CatalogItem]:
    return []

def get_need_items() -> List[NeedItem]:
    return []

def get_appointment_items() -> List[AppointmentItem]:
    return []

@strawberry.type
class Query:
    @strawberry.field
    def catalog(self) -> List[CatalogItem]:
        return get_catalog_items()

    @strawberry.field
    def needs(self) -> List[NeedItem]:
        return get_need_items()

    @strawberry.field
    def appointments(self) -> List[AppointmentItem]:
        return get_appointment_items()

schema = strawberry.Schema(query=Query)
