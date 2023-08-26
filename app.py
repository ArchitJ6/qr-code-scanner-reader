from flask import Flask, render_template, request, jsonify
import qrcode
import base64

app=Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_qr', methods=['POST'])
def generate_qr():
    data = request.form.get('data')
    qr=qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=10, border=4)
    qr.add_data(data)
    qr.make(fit=True)

    qr_image=qr.make_image(fill_color="black", back_color="white")
    qr_image.save('static/qrcode.png')

    with open('static/qrcode.png', 'rb') as f:
        data = f.read()
        qr_image_data = base64.b64encode(data).decode('utf-8')
    
    return jsonify({'image_data':qr_image_data})

if __name__ == '__main__':
    app.run(debug=True)