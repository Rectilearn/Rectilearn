<script lang="ts">
	import { onDestroy, onMount } from "svelte";
    import kaboom, { type AreaComp, type GameObj, type KaboomCtx, type PosComp, type SpriteComp } from "kaboom";
    import "kaboom/global";
	import { onKeysDown, onKeysPressed, onKeysReleased } from "../game";
	import { toast } from "svelte-sonner";
	import Toast from "$lib/components/toast.svelte";

    const avatar = "test";

    let cRef: HTMLCanvasElement;

    let kb: KaboomCtx;

    const layouts = [
    `
    |||||||||||||||||
    |A             A||||||||||||||||||||
    |                                  |
    |                                  |
    |            $                     |
    |           $$  |            $     |
    |          $$$$ |           $$     |
    |          $$$$ |!          $$$   ||
    |          $$$$ |           $$$  ||
    |           $$  |@           $  ||
    |A              |              ||
    |||    ||||||||||             ||
    |                            ||
    |                           ||
    |                         A||
    ||||||||||||||||||||||||||||`.split("\n"),
    ]

    const mapLayout = layouts[Math.floor(Math.random() * layouts.length)]

    mapLayout.shift();

    onMount(() => {
        kb = kaboom({
            canvas: cRef || undefined,
            background: [137, 142, 140],
            width: cRef?.scrollWidth,
            height: cRef?.scrollHeight
        });

        async function Launch() {
            await loadSprite("bean", "/avatars/animations/"+avatar+".png", {
                sliceX: 8,
                anims: {
                    "run": {
                        from: 0,
                        to: 7,
                        speed: 45,
                        loop: true,
                    }
                }
            });			
			await loadSprite("wall", "/sprites/wall.jpeg");
			await loadSprite("water", "/sprites/water.jpeg");
			await loadSprite("grass", "/sprites/grass.png");
			await loadSprite("bg", "/sprites/spaceBg.jpg");

			await loadSprite("upgradeM", "/sprites/upgradeMoney.png");
			await loadSprite("upgradeS", "/sprites/upgradeSpeed.png");

			await loadSprite("apple", "/sprites/apple.png");
			await loadSprite("badBean", "/sprites/badBean.png");

			await loadSprite("spawnArea", "/sprites/spawnArea.png");

			let start = false;
			let SPEED = 400;
			let COST = 1;

			add([
				sprite("bg", {
					width: width(),
					height: height(),
				}),
				pos(0, 0),
				fixed(),
			]);

			const beforeStart = [
				add([
					text("Click Anywhere To Start", {
						size: width() / 25
					}),
					pos(center().x, center().y-60),
					anchor("center"),
				]), 
				add([
					text('use "w", "a", "s" and "d" or arrow keys to move around\npress "space", "e", or "q" to answer questions\nclick to shoot at enemies', {
						size: width() / 50,
						lineSpacing: 10
					}),
					pos(center().x, center().y+100),
					anchor("center"),
				])
			];
			
			async function startGame() {
				if (start) return;
				start = true;

				beforeStart.forEach((e) => {e.destroy()})

				const itemXLen = mapLayout[0].length;
				const itemYLen = mapLayout.length;
				const wallXY = Math.max(
					width() / itemXLen,
					height() / itemYLen
				);
				const mapObj = addLevel(mapLayout, {
					tileWidth: wallXY,
					tileHeight: wallXY,
                    tiles: {
                        "|": () => [
                            sprite("wall", {
                                width: wallXY,
                                height: wallXY,
                            }),
                            area(),
                            body({ isStatic: true }),
                            "wall"
                        ],
                        $: () => [
                            sprite("water", {
                                width: wallXY,
                                height: wallXY,
                            }),
                            area(),
                            body({ isStatic: true }),
                            "water",
                        ],
                        "!": () => [
                            sprite("upgradeM", {
                                width: wallXY,
                                height: wallXY,
                            }),
                            area(),
                            body({ isStatic: true }),
                            "upgradeM",
                        ],
                        "@": () => [
                            sprite("upgradeS", {
                                width: wallXY,
                                height: wallXY,
                            }),
                            area(),
                            body({ isStatic: true }),
                            "upgradeS",
                        ],
                        "A": () => [
                            sprite("spawnArea", {
                                width: wallXY,
                                height: wallXY,
                            }),
                        ],
                        " ": () => [
                            sprite("grass", {
                                width: wallXY,
                                height: wallXY,
                            }),
                        ],
                    }
				});

				scene("gameover", () => {
					add([
						text("Game Over!", {
							size: width() / 25,
						}),
						pos(center()),
						anchor("center"),
					]);
				});

				const player = add([
					sprite("bean", {
						width: wallXY,
					}),
					pos(itemXLen / 2 * wallXY, itemYLen / 2 * wallXY),
					area(),
					body(),
				]);

				const health = add([
					text("Health: 5"),
					pos(0, 0),
					fixed(),
					{ value: 5 },
				]);
				const ammo = add([
					text("Ammo: 10"),
					pos(0, 80),
					fixed(),
					{ value: 10 },
				]);
				const cash = add([
					text("Cash: 0"),
					pos(0, 160),
					fixed(),
					{ value: 0 },
				]);

				let new_enemy_count = 0;
				let enemies: GameObj<
					SpriteComp | PosComp | AreaComp | { speed: number, destroyed: boolean }
				>[] = [];

				function addEnemy() {
					const p = [[1, 1], [15, 1], [1, 10], [26, 14]][Math.floor(Math.random() * 4)]
					let e = add([
						sprite("badBean", {
							width: wallXY,
						}),
						pos(
                            p[0] * wallXY,
                            p[1] * wallXY
							// mapObj.getPos(
							// 		p[0],
							// 		p[1]
							// 	// itemXLen / 20 + rand(1, 20),
							// 	// itemYLen / 10 + rand(1, 10)
							// )
						),
						area(),
						{ speed: rand(10, 25), destroyed: false, direction: {x: rand(-wallXY, wallXY), y: rand(-wallXY, wallXY)} },
					]);
					enemies.push(e);

					e.onUpdate(() => {
						let enemy = e;
						let x = -1 + 2 * +(enemy.pos.x < player.pos.x);
						let y = -1 + 2 * +(enemy.pos.y > player.pos.y);
						enemy.flipX = enemy.pos.x > player.pos.x;
						// enemy.move((x)*10, (y)*(-10))
						// enemy.moveTo(player.pos, enemy.speed);
						enemy.moveTo(player.pos.x+e.direction.x, player.pos.y+e.direction.y, enemy.speed);

						if (enemy.isColliding(player as any)) {
							enemy.destroy();
							if (!enemy.destroyed) {
								health.value--;
								health.text = "Health: " + health.value;
								if (health.value <= 0) {
									go("gameover");
								}
								enemy.destroyed = true
							}
							shake(100)
						}
					});
					// for (var i in enemies) {
					// 	enemies[i].onUpdate(() => {
					// 		let enemy = enemies[i];
					// 		let x = -1 + 2 * +(enemy.pos.x < player.pos.x);
					// 		let y = -1 + 2 * +(enemy.pos.y > player.pos.y);
					// 		enemy.flipX(enemy.pos.x > player.pos.x);
					// 		// enemy.move((x)*10, (y)*(-10))
					// 		enemy.moveTo(player.pos, 10);

					// 		if (enemy.isTouching(player)) {
					// 			enemy.destroy();
					// 			if (!enemy.destroyed) {
					// 				health.value--;
					// 				health.text = "Health: " + health.value;
					// 				if (health.value <= 0) {
					// 					go("gameover");
					// 				}
					// 				enemy.destroyed = true
					// 			}
					// 		}
					// 	});
					// }
					if (new_enemy_count >= 1) {
						new_enemy_count = 0;
						addEnemy();
					}
				}

				for (let i = 0; i < 5; i++) {
					addEnemy();
				}

				player.onUpdate(() => {
					camPos(player.pos);
				});

				onMousePress(() => {
					if (ammo.value <= 0) {
						toast.error("Not enough ammo", {
							description: "Press \"e\" to answer questions, and gain ammo!",
							duration: 5000
						});
						return;
					}
					const m = toWorld(mousePos());
					const e: any = add([
						sprite("apple", {
							width: wallXY/2.5,
						}),
						pos(player.pos.x+wallXY/2.5, player.pos.y+wallXY/2.5),
						lifespan(2),
						area(),
						{
							speed: 100,
							di: [
								m["x"] - player.pos.x - 50,
								m["y"] - player.pos.y - 50,
							],
						},
					]);

					ammo.value--;
					ammo.text = "Ammo: " + ammo.value;

					e.onUpdate(() => {
						e.move(e.di[0], e.di[1]);

						for (let i in enemies) {
							if (e.isColliding(enemies[i])) {
								enemies[i].destroy();
								e.destroy();

								cash.value += COST;
								cash.text = "Cash: " + cash.value;

								new_enemy_count += 0.25;

								addEnemy();
							}
						}
						e.onCollide(("wall"), () => {
							e.destroy();
						})
					});
				});
				
                onKeysDown(["left", "right", "up", "down", "w", "a", "s", "d"], () => {
                    if (player.curAnim() != "run") { player.play("run") }
                })
                onKeysReleased(["left", "right", "up", "down", "w", "a", "s", "d"], () => {
                    player.frame = 0;
                    player.stop();
                })

				onKeysDown(["left", "a"], () => {
					player.flipX = true;
					player.move(-SPEED, 0);
				});

				onKeysPressed(["space", "q", "e", "z"], () => {
					// isOpen(true);
					ammo.value+=5;
					ammo.text = "Ammo: " + ammo.value;
				});

				onKeysDown(["right", "d"], () => {
					player.flipX = false;
					player.move(SPEED, 0);
				});
				onKeysDown(["up", "w"], () => {
					player.move(0, -SPEED);
				});
				onKeysDown(["down", "s"], () => {
					player.move(0, SPEED);
				});

				onKeyPress("f", () => {
					let touching = false;

					get("upgradeM", { recursive: true }).forEach((s: any) => {
						if (player.isColliding(s)) touching = true;
					});
					if (touching) {
						if (cash.value >= COST * 5) {
							cash.value -= COST * 5;
							cash.text = "Cash: " + cash.value;
							COST += COST;
						} else {
                            // alert("Not enough " + COST*5);
							toast.warning("Not enough money", {
								description: 
									"you need $" +
									COST * 5 +
									" for that upgrade!",
								duration: 5000
							});
							// toast({
							// 	title: "Not enough money",
							// 	description:
							// 		"you need $" +
							// 		COST * 5 +
							// 		" for that upgrade!",
							// 	status: "warning",
							// 	duration: 5000,
							// 	isClosable: true,
							// });
						}
					}

					touching = false;

					get("upgradeS", { recursive: true }).forEach((s: any) => {
						if (player.isColliding(s)) touching = true;
					});
					if (touching) {
						if (cash.value >= SPEED / 20) {
							cash.value -= SPEED / 20;
							cash.text = "Cash: " + cash.value;
							SPEED += 200;
						} else {
                            // alert("Not enough " + SPEED / 20);
							toast.warning("Not enough money", {
								description: 
									"you need $" +
									SPEED / 20 +
									" for that upgrade!",
								duration: 5000
							});
							// toast({
							// 	title: "Not enough money",
							// 	description:
							// 		"you need $" +
							// 		SPEED / 20 +
							// 		" for that upgrade!",
							// 	status: "warning",
							// 	duration: 5000,
							// 	isClosable: true,
							// });
						}
					}

					touching = false;
				});


                get("upgradeM", { recursive: true }).forEach((s: any) => {
                    var enabled = false
                    s.onUpdate(() => {
                        if (player.isColliding(s) && enabled == false) {
                            enabled = true;
							toast.info("Upgrade Money Per Hit", {
								description: "Press \"F\" to upgrade money earned after hitting an enemy.",
								duration: 3000
							});
                            // toast({
                            //     title: 'Upgrade Money Per Hit',
                            //     description: "Press \"F\" to upgrade money earned after hitting an enemy.",
                            //     status: 'info',
							// 	variant: "left-accent",
                            //     duration: 3000,
                            //     isClosable: true,
                            // })
                            wait(3.1, () => {enabled = false})
                        }
                    })
                });

                get("upgradeS", { recursive: true }).forEach((s: any) => {
                    var enabled = false
                    s.onUpdate(() => {
                        if (player.isColliding(s) && enabled == false) {
                            enabled = true;
							toast.info("Upgrade Speed", {
								description: "Press \"F\" to upgrade your running speed.",
								duration: 3000
							});
                            // toast({
                            //     title: 'Upgrade Speed',
                            //     description: "Press \"F\" to upgrade your running speed.",
                            //     status: 'info',
							// 	variant: "left-accent",
                            //     duration: 3000,
                            //     isClosable: true,
                            // })
                            wait(3.1, () => {enabled = false})
                        }
                    })
                });
			}
			onTouchEnd(startGame);
			onClick(startGame);
		}
		Launch();
    });

    onDestroy(() => {
        if (!kb) return;
        get("*", { recursive: true }).forEach(destroy);
    });
</script>

<canvas bind:this={cRef} class="w-full h-full"></canvas>

<Toast />