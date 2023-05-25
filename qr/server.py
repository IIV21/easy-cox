from flask import Flask, request, make_response

# Import decode file
import qr_service

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
  
@app.route('/create' ,methods = ['POST'])
def create_qr():
  data = request.args.get('data')
  buff = qr_service.make_qr_buffer(data)
    
  response = make_response(buff.getvalue())
  return response

@app.route('/scan', methods = ['GET'])
def scan_qr():
  data = qr_service.scan()
  
  if (data == ""):
    return "No QR code found"
  
  return data