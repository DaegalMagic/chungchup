class CurtainEffect {
	constructor() {
		const overlay = document.getElementById('curtain-overlay');
		this.viewportWidth = overlay ? overlay.offsetWidth : window.innerWidth;
		this.viewportHeight = overlay ? overlay.offsetHeight : window.innerHeight;
		this.centerX = this.viewportWidth / 2;
		this.centerY = this.viewportHeight * 2 / 3; // 아래서 1/3 지점 (위에서 2/3 지점)

		// 각 페이즈별 독립적 시간 설정
		this.initialWaitDuration = 1000; // 초기 1초 대기
		this.phase0Duration = 500; // 초기 회색 가로줄 생성 (500ms)
		this.phase0WaitDuration = 1000; // 휴면 시간 (1000ms)
		this.phase1Duration = 400; // 꼭지점 이동 (400ms)
		this.phase2Duration = 300; // 대기 시간 (300ms)
		this.phase3Duration = 2000; // 커튼 이동 + 주름 (2초)
		this.totalDuration = this.initialWaitDuration + this.phase0Duration + this.phase0WaitDuration + this.phase1Duration + this.phase2Duration + this.phase3Duration;

		this.startTime = null;
		this.wrinkleLines = [];

		this.init();
	}

	init() {
		this.setupCurtains();
		this.setupWrinkles();
		this.setupInitialGrayLines();
		this.startAnimation();
	}

	setupCurtains() {
		const topLeft = document.getElementById('curtain-top-left');
		const topRight = document.getElementById('curtain-top-right');
		const bottomLeft = document.getElementById('curtain-bottom-left');
		const bottomRight = document.getElementById('curtain-bottom-right');

		// 초기 위치 설정 - 화면 전체를 덮음
		topLeft.style.left = '0px';
		topLeft.style.top = '0px';
		topLeft.style.width = this.centerX + 'px';
		topLeft.style.height = this.centerY + 'px';

		topRight.style.left = this.centerX + 'px';
		topRight.style.top = '0px';
		topRight.style.width = (this.viewportWidth - this.centerX) + 'px';
		topRight.style.height = this.centerY + 'px';

		bottomLeft.style.left = '0px';
		bottomLeft.style.top = this.centerY + 'px';
		bottomLeft.style.width = this.centerX + 'px';
		bottomLeft.style.height = (this.viewportHeight - this.centerY) + 'px';

		bottomRight.style.left = this.centerX + 'px';
		bottomRight.style.top = this.centerY + 'px';
		bottomRight.style.width = (this.viewportWidth - this.centerX) + 'px';
		bottomRight.style.height = (this.viewportHeight - this.centerY) + 'px';
	}

	setupWrinkles() {
		const container = document.getElementById('wrinkles-container');

		if (!container) {
			return;
		}

		// 각 사각형마다 5개씩 세로선 생성 (총 20개)
		const sections = [
			{ id: 'top-left', x: 0, y: 0, w: this.centerX, h: this.centerY },
			{ id: 'top-right', x: this.centerX, y: 0, w: this.viewportWidth - this.centerX, h: this.centerY },
			{ id: 'bottom-left', x: 0, y: this.centerY, w: this.centerX, h: this.viewportHeight - this.centerY },
			{ id: 'bottom-right', x: this.centerX, y: this.centerY, w: this.viewportWidth - this.centerX, h: this.viewportHeight - this.centerY }
		];

		let totalCreated = 0;
		sections.forEach(section => {
			for (let i = 1; i <= 5; i++) {
				const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
				line.classList.add('wrinkle-line');
				line.dataset.section = section.id;
				line.dataset.index = i;

				// 각 섹션을 6등분하여 5개 선 배치 (양끝 제외)
				const isLeftSection = section.id.includes('left');
				const sectionWidth = isLeftSection ? this.centerX : (this.viewportWidth - this.centerX);
				const spacing = sectionWidth / 6; // 6등분

				const x = isLeftSection ?
					(spacing * i) : // 왼쪽 섹션: spacing, 2*spacing, 3*spacing, 4*spacing, 5*spacing
					(this.centerX + (spacing * i)); // 오른쪽 섹션: centerX + spacing, centerX + 2*spacing, ...
				line.setAttribute('x1', x);
				line.setAttribute('y1', section.y);
				line.setAttribute('x2', x);
				line.setAttribute('y2', section.y + section.h);
				line.setAttribute('stroke', '#d1d5db');
				line.setAttribute('stroke-width', '3');
				line.setAttribute('opacity', '0');

				// 초기 상태는 보이지 않음

				container.appendChild(line);
				this.wrinkleLines.push({
					element: line,
					section: section.id,
					index: i,
					originalX: x,
					originalY: section.y,
					originalHeight: section.h,
					activated: false,
					screenPointMoving: false, // 화면 맞닿는 점 이동 여부
					activationCurtainMove: null, // 주름이 활성화될 때의 커튼 이동량 저장
					rotationEndCoords: null, // 회전이 끝날 때의 좌표 저장 {x1, y1, x2, y2}
					linearStartPhaseProgress: null, // 선형이동 시작 시점의 phaseProgress
					activationTime: null, // 활성화 시점 기록
					fadeInDelay: 0, // 페이드인 지연 시간
					fadeInDuration: 150 // 페이드인 지속 시간
				});
				totalCreated++;
			}
		});

	}

	setupInitialGrayLines() {
		const leftLine = document.getElementById('initial-gray-line-left');
		const rightLine = document.getElementById('initial-gray-line-right');

		// 초기 위치 설정: 화면을 관통하는 띠 (커튼 고정용)
		// 왼쪽 반: 화면 왼쪽 끝부터 중심까지
		leftLine.style.left = '0px';
		leftLine.style.top = this.centerY + 'px';
		leftLine.style.width = this.centerX + 'px';

		// 오른쪽 반: 중심부터 화면 오른쪽 끝까지
		rightLine.style.left = this.centerX + 'px';
		rightLine.style.top = this.centerY + 'px';
		rightLine.style.width = (this.viewportWidth - this.centerX) + 'px';
	}

	startAnimation() {
		this.startTime = performance.now();
		this.animate();
	}

	animate() {
		const currentTime = performance.now();
		const elapsed = currentTime - this.startTime;

		// 현재 페이즈와 해당 페이즈 내 진행률 계산
		let currentPhase, phaseProgress;

		if (elapsed <= this.initialWaitDuration) {
			// 초기 1초 대기
			currentPhase = -1;
			phaseProgress = elapsed / this.initialWaitDuration;
		} else if (elapsed <= this.initialWaitDuration + this.phase0Duration) {
			// 페이즈 0: 초기 회색 가로줄 생성
			currentPhase = 0;
			phaseProgress = (elapsed - this.initialWaitDuration) / this.phase0Duration;
		} else if (elapsed <= this.initialWaitDuration + this.phase0Duration + this.phase0WaitDuration) {
			// 페이즈 0.5: 휴면 (대기)
			currentPhase = 0.5;
			phaseProgress = (elapsed - this.initialWaitDuration - this.phase0Duration) / this.phase0WaitDuration;
		} else if (elapsed <= this.initialWaitDuration + this.phase0Duration + this.phase0WaitDuration + this.phase1Duration) {
			// 페이즈 1: 꼭지점 이동
			currentPhase = 1;
			phaseProgress = (elapsed - this.initialWaitDuration - this.phase0Duration - this.phase0WaitDuration) / this.phase1Duration;
		} else if (elapsed <= this.initialWaitDuration + this.phase0Duration + this.phase0WaitDuration + this.phase1Duration + this.phase2Duration) {
			// 페이즈 2: 대기
			currentPhase = 2;
			phaseProgress = (elapsed - this.initialWaitDuration - this.phase0Duration - this.phase0WaitDuration - this.phase1Duration) / this.phase2Duration;
		} else if (elapsed <= this.totalDuration) {
			// 페이즈 3: 커튼 이동 + 주름
			currentPhase = 3;
			phaseProgress = (elapsed - this.initialWaitDuration - this.phase0Duration - this.phase0WaitDuration - this.phase1Duration - this.phase2Duration) / this.phase3Duration;
		} else {
			// 애니메이션 완료
			currentPhase = 4;
			phaseProgress = 1;
		}

		this.updateInitialOverlay(currentPhase, phaseProgress);
		this.updateInitialGrayLines(currentPhase, phaseProgress);
		this.updateCurtains(currentPhase, phaseProgress);
		this.updateWrinkles(currentPhase, phaseProgress);

		if (currentPhase < 4) {
			requestAnimationFrame(() => this.animate());
		} else {
			console.log(`[Timer] Curtain animation ended at: ${performance.now().toFixed(2)}ms`);
			
			// 이미지 로딩 대기 체크 추가
			this.waitForImagesBeforeSpotlight(() => this.cleanup());
		}
	}

	// 핵심 이미지(커버 GIF, 메인 사진) 로딩 대기 함수
	waitForImagesBeforeSpotlight(callback) {
		const imagesToWait = [
			'/chungchup/play_timed.gif',
			'/chungchup/image/DSC05105.jpg'
		];
		
		let loadedCount = 0;
		const checkAllLoaded = () => {
			loadedCount++;
			if (loadedCount === imagesToWait.length) {
				console.log(`[Timer] All critical images loaded. Starting spotlight!`);
				callback();
			}
		};

		// 브라우저 캐시에 이미 있는지 확인 후 없으면 로드 대기
		imagesToWait.forEach(src => {
			const img = new Image();
			img.onload = checkAllLoaded;
			img.onerror = checkAllLoaded; // 에러나도 일단 진행
			img.src = src;
			if (img.complete) checkAllLoaded();
		});

		// 혹시라도 너무 오래 걸리면(2.5초) 강제로 시작 (무한 대기 방지)
		setTimeout(() => {
			if (loadedCount < imagesToWait.length) {
				console.log(`[Timer] Loading timeout. Starting spotlight anyway...`);
				callback();
			}
		}, 2500);
	}

	updateInitialOverlay(currentPhase, phaseProgress) {
		const initialOverlay = document.getElementById('initial-overlay');

		// 오버레이가 존재할 때만 처리
		if (!initialOverlay) return;

		if (currentPhase === -1) {
			// 초기 1초 대기: 투명도 0에서 1로 서서히 변화
			const opacity = this.easeOutCubic(phaseProgress);
			initialOverlay.style.opacity = opacity;

		} else if (currentPhase >= 0) {
			// 페이즈 0 이후: 완전히 보임 상태 유지
			initialOverlay.style.opacity = '1';
		}
	}

	updateInitialGrayLines(currentPhase, phaseProgress) {
		const leftLine = document.getElementById('initial-gray-line-left');
		const rightLine = document.getElementById('initial-gray-line-right');

		if (currentPhase === -1) {
			// 초기 1초 대기: 아무것도 표시하지 않음
			leftLine.style.opacity = '0';
			rightLine.style.opacity = '0';

		} else if (currentPhase === 0) {
			// 페이즈 0: 회색 가로줄 페이드인 (200ms)
			const opacity = this.easeOutCubic(phaseProgress);
			leftLine.style.opacity = opacity;
			rightLine.style.opacity = opacity;

		} else if (currentPhase === 0.5) {
			// 페이즈 0.5: 휴면 상태 (300ms) - 완전 보임
			leftLine.style.opacity = '1';
			rightLine.style.opacity = '1';

		} else if (currentPhase === 1) {
			// 페이즈 1: 꼭지점 이동과 함께 띠가 중앙에서 벌어짐 (찢어지는 효과)
			const maxCornerMove = Math.min(this.centerX, this.centerY) * 0.2;
			const cornerMove = maxCornerMove * this.easeOutCubic(phaseProgress);

			// 왼쪽 띠: 중심에서 왼쪽으로 벌어짐
			leftLine.style.left = '0px';
			leftLine.style.width = (this.centerX - cornerMove) + 'px';

			// 오른쪽 띠: 중심에서 오른쪽으로 벌어짐
			rightLine.style.left = (this.centerX + cornerMove) + 'px';
			rightLine.style.width = (this.viewportWidth - this.centerX - cornerMove) + 'px';

		} else if (currentPhase === 2) {
			// 페이즈 2: 대기 - 찢어진 상태 유지
			const maxCornerMove = Math.min(this.centerX, this.centerY) * 0.2;

			leftLine.style.left = '0px';
			leftLine.style.width = (this.centerX - maxCornerMove) + 'px';
			leftLine.style.opacity = '1';

			rightLine.style.left = (this.centerX + maxCornerMove) + 'px';
			rightLine.style.width = (this.viewportWidth - this.centerX - maxCornerMove) + 'px';
			rightLine.style.opacity = '1';

		} else if (currentPhase === 3) {
			// 페이즈 3: 커튼과 함께 띠도 좌우로 이동 (중앙 꼭지점과 같은 속도)
			const maxMove = this.viewportWidth * 1.5;
			const fastMove = maxMove * this.easeInCubic(phaseProgress * 1.5); // 중앙 꼭지점과 같은 속도
			const maxCornerMove = Math.min(this.centerX, this.centerY) * 0.2;

			// 왼쪽 띠: 왼쪽으로 이동
			leftLine.style.transform = `translateX(${-fastMove}px)`;
			leftLine.style.left = '0px';
			leftLine.style.width = (this.centerX - maxCornerMove) + 'px';
			leftLine.style.opacity = '1';

			// 오른쪽 띠: 오른쪽으로 이동
			rightLine.style.transform = `translateX(${fastMove}px)`;
			rightLine.style.left = (this.centerX + maxCornerMove) + 'px';
			rightLine.style.width = (this.viewportWidth - this.centerX - maxCornerMove) + 'px';
			rightLine.style.opacity = '1';
		}
	}

	updateCurtains(currentPhase, phaseProgress) {
		const topLeft = document.getElementById('curtain-top-left');
		const topRight = document.getElementById('curtain-top-right');
		const bottomLeft = document.getElementById('curtain-bottom-left');
		const bottomRight = document.getElementById('curtain-bottom-right');
		const initialOverlay = document.getElementById('initial-overlay');

		if (currentPhase === 1) {
			// 커튼(네모4개) 생성 시점에서 흰색 덮개 삭제
			if (initialOverlay) {
				initialOverlay.remove();
			}
			// 페이즈 1: 꼭지점만 이동 (400ms)
			const maxCornerMove = Math.min(this.centerX, this.centerY) * 0.2;
			const cornerMove = maxCornerMove * this.easeOutCubic(phaseProgress);

			// 왼쪽 위: 오른쪽 아래 꼭지점이 왼쪽으로
			topLeft.style.clipPath = `polygon(0% 0%, 100% 0%, ${100 - (cornerMove/this.centerX)*100}% 100%, 0% 100%)`;

			// 오른쪽 위: 왼쪽 아래 꼭지점이 오른쪽으로
			topRight.style.clipPath = `polygon(${(cornerMove/(this.viewportWidth-this.centerX))*100}% 100%, 100% 100%, 100% 0%, 0% 0%)`;

			// 왼쪽 아래: 오른쪽 위 꼭지점이 왼쪽으로
			bottomLeft.style.clipPath = `polygon(0% 0%, ${100 - (cornerMove/this.centerX)*100}% 0%, 100% 100%, 0% 100%)`;

			// 오른쪽 아래: 왼쪽 위 꼭지점이 오른쪽으로
			bottomRight.style.clipPath = `polygon(${(cornerMove/(this.viewportWidth-this.centerX))*100}% 0%, 100% 0%, 100% 100%, 0% 100%)`;

		} else if (currentPhase === 2) {
			// 페이즈 2: 대기 (300ms) - clipPath 상태 유지
			const maxCornerMove = Math.min(this.centerX, this.centerY) * 0.2;

			topLeft.style.clipPath = `polygon(0% 0%, 100% 0%, ${100 - (maxCornerMove/this.centerX)*100}% 100%, 0% 100%)`;
			topRight.style.clipPath = `polygon(${(maxCornerMove/(this.viewportWidth-this.centerX))*100}% 100%, 100% 100%, 100% 0%, 0% 0%)`;
			bottomLeft.style.clipPath = `polygon(0% 0%, ${100 - (maxCornerMove/this.centerX)*100}% 0%, 100% 100%, 0% 100%)`;
			bottomRight.style.clipPath = `polygon(${(maxCornerMove/(this.viewportWidth-this.centerX))*100}% 0%, 100% 0%, 100% 100%, 0% 100%)`;

		} else if (currentPhase === 3) {
			// 페이즈 3: 전체 이동 (1600ms) - 중앙 꼭지점만 더 빨리
			const maxMove = this.viewportWidth * 1.5;
			const normalMove = maxMove * this.easeInCubic(phaseProgress); // 모서리 점 속도
			const fastMove = maxMove * this.easeInCubic(phaseProgress * 1.5); // 중앙 꼭지점 속도

			const maxCornerMove = Math.min(this.centerX, this.centerY) * 0.2;

			// 중앙 꼭지점(clipPath 안의 꼭지점)은 빠르게, 모서리는 천천히
			const fastCornerX = this.centerX - maxCornerMove - fastMove; // 왼쪽 중앙 꼭지점
			const fastCornerXRight = this.centerX + maxCornerMove + fastMove; // 오른쪽 중앙 꼭지점

			// 각 사각형은 천천히 이동, clipPath만 빠르게 변경
			topLeft.style.transform = `translateX(${-normalMove}px)`;
			topLeft.style.clipPath = `polygon(0% 0%, 100% 0%, ${((fastCornerX + normalMove) / this.centerX) * 100}% 100%, 0% 100%)`;

			topRight.style.transform = `translateX(${normalMove}px)`;
			topRight.style.clipPath = `polygon(${((fastCornerXRight - normalMove - this.centerX) / this.centerX) * 100}% 100%, 100% 100%, 100% 0%, 0% 0%)`;

			bottomLeft.style.transform = `translateX(${-normalMove}px)`;
			bottomLeft.style.clipPath = `polygon(0% 0%, ${((fastCornerX + normalMove) / this.centerX) * 100}% 0%, 100% 100%, 0% 100%)`;

			bottomRight.style.transform = `translateX(${normalMove}px)`;
			bottomRight.style.clipPath = `polygon(${((fastCornerXRight - normalMove - this.centerX) / this.centerX) * 100}% 0%, 100% 0%, 100% 100%, 0% 100%)`;
		}
	}

	updateWrinkles(currentPhase, phaseProgress) {
		let leftCornerX = null;
		let rightCornerX = null;

		if (currentPhase === 1) {
			// 페이즈 1: clipPath 기반 꼭지점 이동
			const maxCornerMove = Math.min(this.centerX, this.centerY) * 0.2;
			const currentCornerMove = maxCornerMove * this.easeOutCubic(phaseProgress);

			leftCornerX = this.centerX - currentCornerMove;
			rightCornerX = this.centerX + currentCornerMove;

		} else if (currentPhase >= 3) {
			// 페이즈 3: transform 기반 전체 이동
			// 페이즈 1 완료 시의 최종 꼭지점 위치
			const maxCornerMove = Math.min(this.centerX, this.centerY) * 0.2;

			// 페이즈 3에서의 transform 이동량 - 주름 커튼점은 빠르게
			const maxMove = this.viewportWidth * 1.5;
			const fastMove = maxMove * this.easeInCubic(phaseProgress * 1.5); // 커튼과 같은 속도

			// 중앙 꼭지점과 동일한 계산식 사용
			leftCornerX = this.centerX - maxCornerMove - fastMove;
			rightCornerX = this.centerX + maxCornerMove + fastMove;
		}

		if (leftCornerX !== null && rightCornerX !== null) {
			this.wrinkleLines.forEach((wrinkle, index) => {
				if (!wrinkle.activated) {
					const wrinkleX = wrinkle.originalX;
					const isLeftSection = wrinkle.section.includes('left');

					// 주름 간격(x) 계산
					const sectionWidth = isLeftSection ? this.centerX : (this.viewportWidth - this.centerX);
					const spacing = sectionWidth / 6; // x = spacing
					const earlyOffset = spacing / 5; // x/5

					// 꼭지점이 주름 위치에 (x/5) 전에 도달했을 때 활성화
					const shouldActivate = isLeftSection ?
						(leftCornerX <= (wrinkleX + earlyOffset)) :   // 왼쪽: 커튼이 주름보다 (x/5) 오른쪽에 있을 때
						(rightCornerX >= (wrinkleX - earlyOffset));   // 오른쪽: 커튼이 주름보다 (x/5) 왼쪽에 있을 때

					if (shouldActivate) {
						wrinkle.element.classList.add('wrinkle-visible');
						wrinkle.activated = true;
						wrinkle.activationTime = performance.now(); // 활성화 시점 기록

						// 중앙에서 바깥쪽 순서로 지연시간 계산
						const n = isLeftSection ?
							(5 - wrinkle.index) :  // 왼쪽: left-5가 n=0, left-1이 n=4
							(wrinkle.index - 1);   // 오른쪽: right-1이 n=0, right-5가 n=4
						wrinkle.fadeInDelay = 0; // 지연시간 없음
						wrinkle.fadeInDuration = 150; // 150ms에 걸쳐 서서히 나타남
					}
				}

				// 활성화된 주름들 처리
				if (wrinkle.activated) {
					// 투명도 페이드인 처리
					const currentTime = performance.now();
					const elapsed = currentTime - wrinkle.activationTime;

					if (elapsed >= wrinkle.fadeInDelay) {
						// 페이드인 시작 후 경과 시간
						const fadeElapsed = elapsed - wrinkle.fadeInDelay;

						if (fadeElapsed < wrinkle.fadeInDuration) {
							// 페이드인 중: 0에서 0.8로 서서히 증가 (더 진하게)
							const progress = fadeElapsed / wrinkle.fadeInDuration;
							const opacity = 0.8 * this.easeOutCubic(progress);
							wrinkle.element.setAttribute('opacity', Math.max(0, opacity).toString());
						} else {
							// 페이드인 완료: 최대 투명도 유지
							wrinkle.element.setAttribute('opacity', '0.8');
						}
					} else {
						// 지연시간 중: 완전히 투명하게 유지
						wrinkle.element.setAttribute('opacity', '0');
					}
					// 화면 맞닿는 점 이동 조건 확인
					if (!wrinkle.screenPointMoving) {
						const isLeftSection = wrinkle.section.includes('left');
						const sectionWidth = isLeftSection ? this.centerX : (this.viewportWidth - this.centerX);
						const spacing = sectionWidth / 6; // x = 주름 간격

						// 중심에 가까운 순서대로 n 계산 (0부터 시작)
						const n = isLeftSection ?
							(5 - wrinkle.index) :  // 왼쪽: left-5가 n=0, left-1이 n=4
							(wrinkle.index - 1);   // 오른쪽: right-1이 n=0, right-5가 n=4

						// 커튼 이동점 (leftCornerX 또는 rightCornerX)
						const curtainMovingX = isLeftSection ? leftCornerX : rightCornerX;
						const curtainTotalMove = Math.abs(curtainMovingX - this.centerX);

						// 주름이 활성화될 때의 커튼 이동량 저장
						if (wrinkle.activationCurtainMove === null) {
							wrinkle.activationCurtainMove = curtainTotalMove;
						}

						// 회전 정지 조건: 활성화 후 x*(6-n)/6만큼 추가 이동
						const additionalMoveNeeded = spacing * (6 - n) / 6; // x*(6-n)/6
						const rotationStopMove = wrinkle.activationCurtainMove + additionalMoveNeeded;

						// 조건 달성 시 화면 점 이동 시작
						if (curtainTotalMove >= rotationStopMove) {

							// 회전이 끝나는 시점의 좌표를 화면점/커튼점으로 명확히 구분해서 저장
							const isTopSection = wrinkle.section.includes('top');
							wrinkle.rotationEndCoords = {
								screenX: isTopSection ? parseFloat(wrinkle.element.getAttribute('x1')) : parseFloat(wrinkle.element.getAttribute('x2')),
								screenY: isTopSection ? parseFloat(wrinkle.element.getAttribute('y1')) : parseFloat(wrinkle.element.getAttribute('y2')),
								curtainX: isTopSection ? parseFloat(wrinkle.element.getAttribute('x2')) : parseFloat(wrinkle.element.getAttribute('x1')),
								curtainY: isTopSection ? parseFloat(wrinkle.element.getAttribute('y2')) : parseFloat(wrinkle.element.getAttribute('y1'))
							};

							// 이동 시작 시점의 커튼 위치와 phaseProgress 저장
							const isLeftSection = wrinkle.section.includes('left');
							wrinkle.linearStartCurtainX = isLeftSection ? leftCornerX : rightCornerX;
							wrinkle.linearStartPhaseProgress = phaseProgress; // 선형이동 시작 시점의 phaseProgress
							wrinkle.screenPointMoving = true;
						}
					}

					// 주름 업데이트 (회전 또는 이동)
					if (wrinkle.screenPointMoving) {
						// 선형 이동 모드
						this.updateWrinkleLinearMovement(wrinkle, currentPhase, phaseProgress, leftCornerX, rightCornerX);
					} else {
						// 회전 모드
						this.updateWrinkleTilt(wrinkle, currentPhase, phaseProgress, leftCornerX, rightCornerX);
					}
				}
			});
		}
	}

	updateWrinkleTilt(wrinkle, currentPhase, phaseProgress, leftCornerX, rightCornerX) {
		const isLeftSection = wrinkle.section.includes('left');
		const isTopSection = wrinkle.section.includes('top');

		// 회전 모드: 화면 맞닿는 점 고정
		const fixedX = wrinkle.originalX;
		const fixedY = isTopSection ? wrinkle.originalY : (wrinkle.originalY + wrinkle.originalHeight); // top이면 위점 고정, bottom이면 아래점 고정

		// 커튼점 위치는 매개변수로 받음
		const cornerX = isLeftSection ? leftCornerX : rightCornerX;
		const cornerY = this.centerY;

		if (cornerX !== undefined && cornerY !== undefined) {
			// 이동점은 반드시 꼭지점 이동경로(y = this.centerY)에 맞닿아야 함
			const movingX = cornerX;
			const movingY = this.centerY; // 꼭지점 이동경로인 중앙 가로선에 고정

			// 고정점에서 이동점까지의 실제 거리 계산 (길이가 늘어남)
			const dx = movingX - fixedX;
			const dy = movingY - fixedY;
			const currentLength = Math.sqrt(dx * dx + dy * dy);

			// 원래 섹션 높이 (회전하지 않을 때)
			const originalSectionHeight = isTopSection ? this.centerY : (this.viewportHeight - this.centerY);

			// 기본 회전각 c 계산 (1페이즈 완료 시 커튼 기울기)
			const maxCornerMove = Math.min(this.centerX, this.centerY) * 0.2;
			const basicAngle = Math.atan(maxCornerMove / originalSectionHeight);

			// 현재 회전각 계산 (꼭지점 이동에 비례)
			const currentCornerMove = Math.abs(cornerX - this.centerX);
			const currentAngle = Math.atan(currentCornerMove / originalSectionHeight);

			// 최대 회전각 y는 기본각의 3배로 설정
			const maxAngle = basicAngle * 3;
			const rotationAngle = Math.min(currentAngle, maxAngle);

			// 실제 좌표는 이미 계산됨 (이동점이 꼭지점 경로에 맞닿음)
			const newMovingX = movingX;
			const newMovingY = movingY;

			// SVG 라인 업데이트
			if (isTopSection) {
				// top 섹션: 위점 고정, 아래점 이동
				wrinkle.element.setAttribute('x1', fixedX);
				wrinkle.element.setAttribute('y1', fixedY);
				wrinkle.element.setAttribute('x2', newMovingX);
				wrinkle.element.setAttribute('y2', newMovingY);
			} else {
				// bottom 섹션: 아래점 고정, 위점 이동
				wrinkle.element.setAttribute('x1', newMovingX);
				wrinkle.element.setAttribute('y1', newMovingY);
				wrinkle.element.setAttribute('x2', fixedX);
				wrinkle.element.setAttribute('y2', fixedY);
			}
		}
	}

	updateWrinkleLinearMovement(wrinkle, currentPhase, phaseProgress, leftCornerX, rightCornerX) {
		const isLeftSection = wrinkle.section.includes('left');
		const isTopSection = wrinkle.section.includes('top');

		// 회전이 끝났을 때의 좌표는 이미 전환 시점에 저장되었음

		// 커튼점 위치는 매개변수로 받음
		const cornerX = isLeftSection ? leftCornerX : rightCornerX;
		const cornerY = this.centerY;

		if (cornerX !== undefined && cornerY !== undefined) {
			// 화면 맞닿는 점: 회전 종료 시점 위치에서 상대적 진행률로 이동
			const direction = isLeftSection ? -1 : 1;
			const maxMove = this.viewportWidth * 1.5;

			// 전체 진행률 기반 이동량에서 시작점 이동량을 빼서 실제 이동량 계산
			const totalScreenMove = maxMove * this.easeInCubic(phaseProgress);  // 전체 이동량
			const startingScreenMove = maxMove * this.easeInCubic(wrinkle.linearStartPhaseProgress); // 시작 시점 이동량
			const screenMove = totalScreenMove - startingScreenMove; // 실제 이동량 (시작점에서 0부터 시작)

			// 회전 종료 시점의 화면 맞닿는 점에서 상대적 이동
			const screenMovingX = wrinkle.rotationEndCoords.screenX + (direction * screenMove);
			const screenMovingY = wrinkle.rotationEndCoords.screenY;


			// SVG 라인 업데이트: 회전된 상태를 유지하면서 이동
			if (isTopSection) {
				// top 섹션: x1=화면점, x2=커튼점
				wrinkle.element.setAttribute('x1', screenMovingX);
				wrinkle.element.setAttribute('y1', screenMovingY);
				wrinkle.element.setAttribute('x2', cornerX);
				wrinkle.element.setAttribute('y2', cornerY);
			} else {
				// bottom 섹션: x1=커튼점, x2=화면점
				wrinkle.element.setAttribute('x1', cornerX);
				wrinkle.element.setAttribute('y1', cornerY);
				wrinkle.element.setAttribute('x2', screenMovingX);
				wrinkle.element.setAttribute('y2', screenMovingY);
			}

		}
	}

	cleanup() {
		console.log('애니메이션 완료 및 정리 중 (정밀 좌표 계산 모드)...');
		const container = document.getElementById('black-overlay-container');
		const path = document.getElementById('spotlight-path');
		const overlay = document.getElementById('curtain-overlay');
		const notebookContainer = document.getElementById('notebook-container');
		const tabBar = document.getElementById('tab-bar');

		// 수첩 컨테이너를 가장 먼저 즉시 나타나게 함 (스포트라이트 전 대기)
		if (notebookContainer) {
			notebookContainer.style.opacity = '1';
			notebookContainer.style.pointerEvents = 'auto';
		}

		if (container && path) {
			// 0. 좌표 계산
			const angleRad = 8 * Math.PI / 180; // 8도 라디안 변환
			const tanVal = Math.tan(angleRad);
			
			// 하단 탭 바 위치를 기준으로 스포트라이트가 멈출 높이 결정
			let stopHeight = this.viewportHeight;
			if (tabBar) {
				stopHeight = tabBar.offsetTop + 10;
			}
			
			const bottomOffset = stopHeight * tanVal;
			const x1 = this.viewportWidth * 0.3;
			const x2 = this.viewportWidth * 0.7;

			console.log(`[Timer] Calculated - Viewport: ${this.viewportWidth}x${this.viewportHeight}, StopHeight: ${stopHeight}`);

			// 1. SVG Path 생성
			const spot1Path = `M ${x1},0 L ${x1 - bottomOffset},${stopHeight} L ${x1 + bottomOffset},${stopHeight} Z`;
			const spot2Path = `M ${x2},0 L ${x2 - bottomOffset},${stopHeight} L ${x2 + bottomOffset},${stopHeight} Z`;
			
			path.setAttribute('d', `${spot1Path} ${spot2Path}`);

			// 2. 오버레이 즉시 표시 (transition 없이)
			console.log(`[Timer] Spotlight showing at: ${performance.now().toFixed(2)}ms`);
			container.style.transition = 'none'; // 초기엔 transition 제거
			container.style.display = 'block';
			container.style.opacity = '1';
			
			// 강제 리플로우 (브라우저가 위 설정을 즉시 반영하도록 함)
			container.offsetHeight; 

			// 3. 1초 대기 후 서서히 투명해짐
			setTimeout(() => {
				console.log(`[Timer] Spotlight fade-out start at: ${performance.now().toFixed(2)}ms`);
				container.style.transition = 'opacity 1.3s ease-in-out';
				container.style.opacity = '0';

				setTimeout(() => {
					if (overlay) {
						overlay.style.opacity = '0';
						setTimeout(() => {
							overlay.remove();
							console.log(`[Timer] Full animation finished at: ${performance.now().toFixed(2)}ms`);
							window.dispatchEvent(new CustomEvent('curtain-animation-finished'));
						}, 300);
					} else {
						window.dispatchEvent(new CustomEvent('curtain-animation-finished'));
					}
				}, 1300);
			}, 1000);

		} else {
			// fallback
			if (notebookContainer) {
				notebookContainer.style.opacity = '1';
				notebookContainer.style.pointerEvents = 'auto';
			}
			if (overlay) {
				overlay.style.opacity = '0';
				setTimeout(() => {
					overlay.remove();
					window.dispatchEvent(new CustomEvent('curtain-animation-finished'));
				}, 300);
			}
		}
	}

	// 이징 함수들
	easeOutCubic(t) {
		return 1 - Math.pow(1 - t, 3);
	}

	easeInCubic(t) {
		return t * t * t;
	}

	easeOutQuad(t) {
		return 1 - (1 - t) * (1 - t);
	}
}

// 페이지 로드 시 커튼 효과 시작
window.addEventListener('load', () => {
	window.curtainEffectInstance = new CurtainEffect();
});

// 페이지가 이미 로드된 경우를 위한 체크
if (document.readyState === 'complete') {
	window.curtainEffectInstance = new CurtainEffect();
}