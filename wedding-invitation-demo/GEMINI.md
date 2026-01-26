# 프로젝트 컨텍스트: 모바일 청첩장

이 문서는 Gemini가 이 프로젝트에서 작업을 수행할 때 참고해야 할 핵심적인 구조와 규칙을 담고 있습니다.

### 1. 프로젝트 목적
- 모바일 기기에 최적화된 웹 청첩장입니다.

### 2. 핵심 기술
- **Astro** 프레임워크를 기반으로 구축되었습니다.

### 3. 중요 디렉토리 구조
- 현재 작업 디렉토리(`chungchupjang`) 안에 실제 소스 코드를 담고 있는 **`wedding-invitation-demo`** 라는 하위 디렉토리가 존재합니다.
- **모든 소스 코드 수정은 반드시 `wedding-invitation-demo` 폴더 내에서 이루어져야 합니다.** (이것이 가장 중요한 규칙입니다.)

### 4. 주요 파일
- **페이지 소스:** `wedding-invitation-demo/src/pages/index.astro`
  - 청첩장의 모든 HTML 구조와 페이지 넘김 로직을 담고 있는 유일한 페이지 파일입니다.
- **커튼 애니메이션 스크립트:** `wedding-invitation-demo/public/curtain-animation.js`
  - 웹사이트 시작 시 나타나는 커튼 애니메이션을 제어합니다.
- **주요 스타일:** `wedding-invitation-demo/src/styles/global.css` 및 `index.astro` 내의 `<style>` 태그
  - 전체적인 디자인과 수첩 UI 스타일을 정의합니다.

### 5. 페이지 동작 순서 (메커니즘)
- 사용자가 접속하면 `index.astro` 페이지가 로드됩니다.
- `curtain-animation.js`가 실행되어 화면 전체에 커튼이 열리는 애니메이션을 보여줍니다.
- 커튼 애니메이션이 끝나면, 해당 스크립트의 `cleanup` 함수가 수첩 UI(`notebook-container`)를 화면에 표시하고, "애니메이션 종료" 신호(`curtain-animation-finished` 이벤트)를 보냅니다.
- `index.astro` 내의 페이지 넘김 스크립트가 이 신호를 감지합니다.
- 3초 대기 후, 스크립트가 자동으로 수첩의 표지(`tab-cover`)를 넘겨 첫 페이지(`tab-home`)를 보여줍니다.
- 이후 사용자는 하단의 탭 메뉴를 통해 각 페이지(홈, 오시는 길, 갤러리 등)를 책장처럼 넘기며 상호작용할 수 있습니다.
- **참고:** 페이지의 추가, 삭제, 순서 변경 등 전체적인 페이지 구성에 변화가 있을 경우, 이 "5. 페이지 동작 순서 (메커니즘)" 섹션 또한 업데이트해야 합니다. 특히 `index.astro` 내의 `tabOrder` 배열과 `initPages` 함수 로직도 함께 검토하고 수정해야 합니다.
