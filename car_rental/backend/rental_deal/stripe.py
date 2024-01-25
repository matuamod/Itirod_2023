import stripe
import time

stripe.api_key = "sk_test_51OV92nFiAt0FTsnrfWGX0nxrwCoEc22ORyoc7gbE35rJSUAmhhSEjBcsdUwrPoMouSTHcmvRJf2eoJBEbmAU7TyR00ewZnTNRw"


def create_rental_plan(amount, currency="usd", interval="month"):
    product_name = f"Product_{int(time.time())}"
    product = stripe.Product.create(name=product_name, type='service')
    plan = stripe.Plan.create(
        amount=amount,
        currency="usd", 
        interval=interval,  
        product=product.id  
    )
    return plan.id
