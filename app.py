from flask import Flask, request, send_file
from PIL import Image, ImageFilter
import io

app = Flask(__name__)

@app.route('/enhance-photo', methods=['POST'])
def enhance_photo():
    if 'photo' not in request.files:
        return "No photo uploaded", 400

    photo = request.files['photo']
    image = Image.open(photo)

    # Example enhancement logic (placeholder for AI model)
    enhanced_image = image.filter(ImageFilter.SHARPEN)

    # Save the enhanced image to a buffer
    buffer = io.BytesIO()
    enhanced_image.save(buffer, format="JPEG")
    buffer.seek(0)

    return send_file(buffer, mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(debug=True)
