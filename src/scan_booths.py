from PIL import Image

img = Image.open('./public/assets/venue-map-styled.jpg')
width, height = img.size
print(f"Image dimensions: {width}x{height}")

# Function to find horizontal/vertical black lines in a bounding box
# Black pixel defined as R, G, B all < 70
def count_black_x(y, x_start, x_end):
    return sum(1 for x in range(x_start, x_end) if sum(img.getpixel((x, y))) // 3 < 70)

def count_black_y(x, y_start, y_end):
    return sum(1 for y in range(y_start, y_end) if sum(img.getpixel((x, y))) // 3 < 70)

# Let's find Y coordinate ranges for Row 1 booths (Booths 1-6)
# Horizontally, they are roughly at x: 60..200
# Vertically, let's scan y: 200..360
print("\n--- Booths 1-6 Y-profile ---")
for y in range(200, 360):
    c = count_black_x(y, 60, 200)
    if c > 20:
        print(f"y={y}: count={c}")

# Let's find Y coordinate ranges for Row 2 booths (Booths 85-78)
# Horizontally, they are roughly at x: 60..200
# Vertically, let's scan y: 440..580
print("\n--- Booths 85-78 Y-profile ---")
for y in range(440, 580):
    c = count_black_x(y, 60, 200)
    if c > 20:
        print(f"y={y}: count={c}")
