# 청첩장 프로젝트 - Claude 가이드

## 프로젝트 개요
모바일 청첩장 웹사이트 프로젝트입니다. Astro 프레임워크와 Tailwind CSS를 사용하여 구현되었습니다.

## GitHub 설정 및 가이드

### GitHub 저장소 정보
- **저장소**: https://github.com/DaegalMagic/chungchup
- **브랜치**: main
- **소유자**: DaegalMagic

### GitHub 작업 시 중요 사항
1. **MCP GitHub 도구를 최우선으로 사용하세요**
   - 일반 bash git 명령어 대신 `mcp__github__*` 도구들을 사용
   - 더 안전하고 효율적인 GitHub 연동 가능
   - 예: `mcp__github__push_files`, `mcp__github__create_or_update_file` 등

2. **주요 MCP GitHub 도구들**
   - `mcp__github__push_files`: 여러 파일을 한 번에 푸시
   - `mcp__github__create_or_update_file`: 단일 파일 생성/업데이트
   - `mcp__github__create_branch`: 새 브랜치 생성
   - `mcp__github__create_pull_request`: PR 생성

3. **파일 업로드 시 주의사항**
   - node_modules, .env 파일 등은 .gitignore에 추가하여 제외
   - 한국어 파일명도 정상적으로 처리됨

### Git 활용 및 버전 관리 가이드

**개발 중 Git 사용 원칙:**
1. **모든 수정사항을 적극적으로 기록하세요**
   - 작은 기능 변경이라도 커밋으로 기록
   - 의미있는 커밋 메시지 작성
   - 기능 단위별로 커밋 분리

2. **커밋과 푸시 구분**
   - **자잘한 변경사항**: 로컬 커밋만 실행 (bash git 사용)
   - **큰 요구사항 완료**: 사용자가 만족하고 확정되면 그때 푸시 (MCP GitHub 도구 사용)
   - 기능 구현 → 로컬 테스트 → 정상 작동 확인 → 로컬 커밋 → (확정 시) GitHub 푸시

3. **커밋 메시지 규칙**
   ```
   기능: 새로운 기능 추가
   수정: 기존 기능 개선
   버그: 버그 수정
   디자인: UI/UX 변경
   리팩토링: 코드 구조 개선
   ```

4. **개발 워크플로우**
   - 기능 개발 → `npm run dev`로 로컬 테스트
   - Playwright MCP로 브라우저 테스트
   - 정상 작동 확인 → 로컬 커밋 (bash git 사용)
   - 사용자 확정 시 → MCP GitHub 도구로 푸시

## 프로젝트 구조
```
C:\Daegal\nogame\chungchupjang\
├── wedding-invitation-demo/     # 메인 Astro 프로젝트
│   ├── src/
│   │   ├── pages/
│   │   │   └── index.astro     # 메인 청첩장 페이지
│   │   └── styles/
│   │       └── global.css      # 글로벌 스타일
│   ├── package.json
│   └── astro.config.mjs
├── 청첩장_기획서.md             # 프로젝트 기획 문서
├── 모바일_청첩장_요소_분석.txt    # 요소 분석 문서
└── .gitignore
```

## 개발 가이드

### 로컬 개발 환경
```bash
cd wedding-invitation-demo
npm run dev
```

### 주요 기능
- 페이드인 효과: 페이지 로드 시 1초간 cube-in 애니메이션
- 반응형 디자인: 모바일 우선 설계
- 청첩장 필수 요소들 모두 포함

## 웹 개발 및 테스트 가이드

### Playwright MCP 사용
웹 관련 개발, 테스트, 스크린샷 촬영 시 **Playwright MCP 도구를 최우선으로 사용하세요**

**주요 Playwright MCP 도구들:**
- `mcp__playwright__puppeteer_navigate`: 웹페이지 탐색
- `mcp__playwright__puppeteer_screenshot`: 스크린샷 촬영
- `mcp__playwright__puppeteer_click`: 요소 클릭
- `mcp__playwright__puppeteer_fill`: 입력 필드 작성
- `mcp__playwright__puppeteer_evaluate`: JavaScript 실행
- `mcp__playwright__puppeteer_hover`: 요소 호버

**사용 예시:**
1. 개발 서버 실행 후 웹페이지 확인
2. 페이드인 효과 테스트
3. 모바일 반응형 디자인 확인
4. 스크린샷으로 디자인 검증

### 배포
GitHub에 푸시하면 자동으로 배포됩니다.

## 코드 수정 시 필수 원칙

### 수정 전 계획 수립 및 검토
**모든 코드 수정 작업은 다음 단계를 거쳐야 합니다:**

1. **문제 분석**: 현재 문제점을 명확히 파악하고 정의
2. **계획 수립**: 수정할 내용과 방법을 구체적으로 계획
3. **비판적 검토**: 계획한 수정 사항을 논리적으로 검증
   - 의도한 결과가 나올 것인지 검토
   - 부작용이나 다른 문제를 일으킬 가능성 검토
   - 다른 부분에 영향을 주지 않는지 확인
4. **수정 실행**: 검토가 완료된 후에만 실제 코드 수정 진행

### 예시
```
문제: 아래쪽 회전 방향이 틀렸음

계획: direction 로직을 수정하여 모든 왼쪽은 -1, 오른쪽은 1로 통일

비판적 검토:
- 커튼이 가운데로 열리므로 왼쪽은 왼쪽으로, 오른쪽은 오른쪽으로 당겨짐
- 위/아래 구분 없이 방향은 동일해야 함
- 고정점만 다르고 회전 방향은 동일해야 함
- 논리적으로 문제없음

수정 실행: const direction = isLeft ? -1 : 1;
```

**중요: 성급한 수정으로 인한 반복 작업을 방지하기 위해 이 원칙을 반드시 준수하세요.**

## 프로젝트 용어집

### 애니메이션 시스템 용어
**커튼 (Curtain)**
- 정의: 4개의 하얀 사각형 패널 (`curtain-top-left`, `curtain-top-right`, `curtain-bottom-left`, `curtain-bottom-right`)
- 역할: 청첩장 내용을 가리고 있다가 애니메이션으로 열리면서 내용을 드러내는 시각 효과
- 움직임: clip-path를 이용해 모양이 변형되면서 가운데부터 열림
- 특징: Phase 3에서 중앙 꼭지점이 모서리보다 빠르게 움직여 더 역동적인 개방 효과 구현

**분할선 (Division Line)**
- 정의: 화면을 위아래로 나누는 회색 수평선 (`initial-gray-line-left`, `initial-gray-line-right`)
- 역할: 커튼 애니메이션의 시작점 표시 및 "찢어지는" 효과 연출
- 위치: centerY 지점 (화면 높이의 2/3 지점)에 위치
- 구성: 왼쪽 절반과 오른쪽 절반으로 분리된 두 개의 요소
- 움직임: Phase 1에서 중앙부터 좌우로 찢어지며, Phase 3에서 커튼과 함께 좌우로 이동
- 특징: 커튼이 열리는 기준선 역할을 하며 애니메이션의 시각적 가이드라인 제공

**주름 (Wrinkles)**
- 정의: SVG 컨테이너 내 20개의 세로선 (`<line>` 요소들)
- 역할: 커튼이 열릴 때 생기는 주름 효과를 시뮬레이션
- 위치: 각 커튼 섹션(상좌, 상우, 하좌, 하우)마다 5개씩 배치
- 움직임 모드:
  - 회전 모드: 커튼 움직임에 따라 기울어지는 회전 애니메이션
  - 선형 이동 모드: 화면 맞닿는 점이 커튼과 같은 속도로 이동
- 특징: 커튼의 물리적 변형을 시각적으로 표현하여 더욱 사실적인 효과 연출

### 애니메이션 단계 용어
**Phase 0**: 초기 대기 (500ms) - 페이드인 효과
**Phase 1**: 커튼 모양 변형 (1000ms) - 사각형에서 다이아몬드 형태로 변형
**Phase 2**: 주름 회전 애니메이션 (1500ms) - 주름이 커튼 변형에 따라 기울어짐
**Phase 3**: 커튼 이동 + 주름 (2000ms) - 커튼과 주름이 함께 좌우로 이동하며 완전히 열림

### 좌표계 및 위치 용어
**중앙 꼭지점**: 커튼의 중앙 부분에 위치한 clip-path 좌표점 (Phase 3에서 빠른 속도로 이동)
**모서리 점**: 화면 가장자리에 위치한 clip-path 좌표점 (Phase 3에서 일반 속도로 이동)
**화면점**: 주름 선의 양 끝 중 화면 가장자리에 맞닿는 점
**커튼점**: 주름 선의 양 끝 중 커튼 꼭지점 위치에 있는 점
**섹션**: 커튼이 4개로 나뉘는 영역 (top-left, top-right, bottom-left, bottom-right)