<script>
// @ts-nocheck

	import { onMount } from 'svelte';

	let canvas;
	let ctx;
	let particles = [];

	class Particle {
		constructor(x, y) {
			this.x = x;
			this.y = y;
			this.size = Math.random() * 5 + 2;
			this.speedY = Math.random() * 2 + 1;
			this.color = `rgba(255, ${Math.random() * 100 + 50}, 0, ${Math.random() * 0.8})`;
		}

		update() {
			this.y -= this.speedY;
			this.size *= 0.98; 
		}

		draw() {
			ctx.fillStyle = this.color;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.fill();
		}
	}

	function animate() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		particles.push(new Particle(canvas.width / 2, canvas.height));
		particles.forEach((p, index) => {
			p.update();
			p.draw();
			if (p.size < 0.5) particles.splice(index, 1);
		});
		requestAnimationFrame(animate);
	}

	onMount(() => {
		canvas.width = 100;
		canvas.height = 150;
		ctx = canvas.getContext('2d');
		animate();
	});
</script>

<canvas bind:this={canvas} class="bg-transparent"></canvas>
