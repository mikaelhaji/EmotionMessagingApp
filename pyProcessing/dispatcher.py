from werkzeug.middleware.dispatcher import DispatcherMiddleware # use to combine each Flask app into a larger one that is dispatched based on prefix
from flaskserve import app as flask_app_1
from cortexconnection import app as flask_app_2
from werkzeug.serving import run_simple # werkzeug development server

application = DispatcherMiddleware(flask_app_1, {
    '/flask_app_2': flask_app_2
})

if __name__ == '__main__':
    run_simple('localhost', 5000, application, use_reloader=True, use_debugger=True, use_evalex=True)