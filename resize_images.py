import os
from PIL import Image

image_dir = 'wedding-invitation-demo/public/image'
output_dir = 'wedding-invitation-demo/public/image'
files = [f for f in os.listdir(image_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
files.sort() # 이름순 정렬

for i, filename in enumerate(files, 1):
    img_path = os.path.join(image_dir, filename)
    try:
        with Image.open(img_path) as img:
            # 해상도 75% 감소 (가로, 세로를 각각 0.25배로 축소)
            new_size = (int(img.width * 0.25), int(img.height * 0.25))
            resized_img = img.resize(new_size, Image.Resampling.LANCZOS)
            
            # 새로운 파일명: 1.jpg, 2.jpg ...
            new_filename = f"{i}.jpg"
            output_path = os.path.join(output_dir, new_filename)
            
            # 저장 (JPEG 품질 설정)
            resized_img.save(output_path, "JPEG", quality=85)
            print(f"Resized and renamed: {filename} -> {new_filename}")
            
            # 원본 파일 삭제 (선택 사항이나 이름 변경을 위해 기존 파일 정리 필요)
            if filename != new_filename:
                os.remove(img_path)
    except Exception as e:
        print(f"Error processing {filename}: {e}")
