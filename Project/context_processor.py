from user.forms import AuthenticationFormNew

def get_context_data(*args, **kw):
    """Currently, the context processor is used only to provide an authorization form on any page of the site"""

    context = {
        'login': AuthenticationFormNew(),
    }

    return context