from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db.session import get_session
from app.deps import get_current_user
from app.models.user import User
from app.models.cart import Cart, CartItem
from app.models.listing import Listing
from app.schemas.cart import CartPublic, CartItemPublic
from app.schemas.listing import ListingPublic

router = APIRouter()

def get_or_create_cart(session: Session, user: User) -> Cart:
    if not user.cart:
        cart = Cart(user_id=user.id)
        session.add(cart)
        session.commit()
        session.refresh(cart)
        session.refresh(user) # refresh user to load the relationship
    return user.cart

@router.get("", response_model=CartPublic)
def get_cart(user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    cart = get_or_create_cart(session, user)
    # Ensure items are loaded
    session.refresh(cart)
    
    # Calculate totals
    total_items = len(cart.items)
    total_price = sum(item.listing.price for item in cart.items)
    
    # Convert to schema
    items_public = [
        CartItemPublic(
            id=item.id,
            listing=ListingPublic(
                id=item.listing.id,
                title=item.listing.title,
                description=item.listing.description,
                price=item.listing.price,
                category=item.listing.category.value,
                is_sold=item.listing.is_sold,
                photo_url=item.listing.photo_url,
                seller_id=item.listing.seller_id
            )
        ) for item in cart.items
    ]
    
    return CartPublic(
        id=cart.id,
        items=items_public,
        total_items=total_items,
        total_price=total_price
    )

@router.post("/add/{listing_id}", response_model=CartPublic)
def add_to_cart(listing_id: int, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    cart = get_or_create_cart(session, user)
    listing = session.get(Listing, listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Check if already in cart
    existing_item = session.exec(select(CartItem).where(CartItem.cart_id == cart.id, CartItem.listing_id == listing_id)).first()
    if existing_item:
        raise HTTPException(status_code=400, detail="Item already in cart")

    cart_item = CartItem(cart_id=cart.id, listing_id=listing_id)
    session.add(cart_item)
    session.commit()
    session.refresh(cart)
    
    return get_cart(user, session)

@router.delete("/items/{item_id}", response_model=CartPublic)
def remove_from_cart(item_id: int, user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    cart = get_or_create_cart(session, user)
    item = session.get(CartItem, item_id)
    if not item or item.cart_id != cart.id:
        raise HTTPException(status_code=404, detail="Item not found in cart")
    
    session.delete(item)
    session.commit()
    session.refresh(cart)
    
    return get_cart(user, session)
