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

2. **테스트 완료 후 저장소 업로드 필수**
   - 기능 구현 → 로컬 테스트 → 정상 작동 확인 → GitHub 푸시
   - Playwright MCP로 테스트 후 이상 없으면 즉시 저장소에 반영
   - 브라우저에서 페이드인 효과, 반응형 디자인 등 확인 완료 후 푸시

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
   - 정상 작동 확인 → MCP GitHub 도구로 푸시

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