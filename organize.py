import os
import re

html_files = ["shop.html", "shop_food.html", "profile.html", "bacode_done.html"]

os.makedirs("pages", exist_ok=True)

# rename main to index.html
if os.path.exists("main.html"):
    os.rename("main.html", "index.html")

# move other html files to pages/
for f in html_files:
    if os.path.exists(f):
        os.rename(f, os.path.join("pages", f))

def optimize_html(content, title, is_page=False):
    # Add title if missing
    if '<title>' not in content:
        content = re.sub(r'(<meta charset="utf-8"/>)', f'\\1\n<title>{title}</title>', content)
        
    # Add preconnect for Google Fonts
    if 'fonts.gstatic.com' not in content:
        content = re.sub(r'(<title>.*?</title>)', r'\1\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>', content)
        
    # Update asset paths
    if is_page:
        content = content.replace('href="css/styles.css"', 'href="../css/styles.css"')
        content = content.replace('src="js/tailwind.config.js"', 'src="../js/tailwind.config.js"')
        content = content.replace('href="shop.html"', 'href="shop.html"')
        content = content.replace('href="index.html"', 'href="../index.html"')
        # Update other potential links if needed
    else:
        # In index.html, linking to pages
        content = content.replace('href="shop.html"', 'href="pages/shop.html"')
        content = content.replace('href="shop_food.html"', 'href="pages/shop_food.html"')
        content = content.replace('href="profile.html"', 'href="pages/profile.html"')
        content = content.replace('href="bacode_done.html"', 'href="pages/bacode_done.html"')

    # Add loading="lazy" to images for performance
    if 'loading="lazy"' not in content:
        content = content.replace('<img ', '<img loading="lazy" ')
        
    return content

# Process index.html
if os.path.exists("index.html"):
    with open("index.html", "r", encoding="utf-8") as f:
        content = f.read()
    
    content = optimize_html(content, "AllergyFree - 홈", is_page=False)
    
    with open("index.html", "w", encoding="utf-8") as f:
        f.write(content)

# Process files in pages/
titles = {
    "shop.html": "AllergyFree - 안전한 쇼핑",
    "shop_food.html": "AllergyFree - 상품 상세",
    "profile.html": "AllergyFree - 프로필 설정",
    "bacode_done.html": "Scan Results - AllergyFree"
}

for f in html_files:
    path = os.path.join("pages", f)
    if not os.path.exists(path):
        continue
    with open(path, "r", encoding="utf-8") as file_obj:
        content = file_obj.read()
        
    content = optimize_html(content, titles.get(f, 'AllergyFree'), is_page=True)

    with open(path, "w", encoding="utf-8") as file_obj:
        file_obj.write(content)
        
# Clean up temp scripts
if os.path.exists("optimize.py"):
    os.remove("optimize.py")
