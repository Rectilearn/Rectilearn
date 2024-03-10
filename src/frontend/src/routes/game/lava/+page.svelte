<script lang="ts">
	import { onDestroy, onMount } from "svelte";
    import kaboom, { type KaboomCtx } from "kaboom";
    import "kaboom/global";
	import { onKeysDown, onKeysPressed, onKeysReleased } from "../game";

    const avatar = "test";

    let cRef: HTMLCanvasElement;

    let kb: KaboomCtx;

    const gameMap = `
    $                  $
    |                  |
    |                  |
    |                  |
    |                  |
    |                  |
    |                  |
    |                  |
    |                  |
    |                  |
    |                  |
    |                  |
    |                  |
    |$$$$$$$$$$$$$$$$$$|
    |$$$$$$$$$$$$$$$$$$|
    |$$$$$$$$$$$$$$$$$$|
    |$$$$$$$$$$$$$$$$$$|
    |$$$$$$$$$$$$$$$$$$|`.split("\n");
    gameMap.shift();

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
            await loadSprite("grayBg", "/sprites/grayBg.webp");
            await loadSprite("lava", "/sprites/lava.jpeg");
            await loadSprite("wall", "/sprites/wall.jpeg");
            await loadSprite("platform", "/sprites/platform.jpeg");

            let start = false;

            setGravity(2500);

            add([
                sprite("grayBg", {
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
                    text('use "a" and "d" or arrow keys to move around\npress "z", "e", or "q" to answer questions\nuse the space bar or "w" to jump', {
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

                const mapX = gameMap[0].length;
                const mapY = gameMap.length;

                const wallXY = Math.max(width() / mapX, height() / mapY);

                const SPEED = wallXY * 10;
                const JUMP_FORCE = wallXY * 16;
                const NUM_PLATFORMS = 5;

                let lavaRaiseSpeed = height()/100;

                scene("gameover", () => {
                    add([
                        text("Game Over!", {
                            size: width() / 25,
                        }),
                        pos(center()),
                        anchor("center"),
                    ]);
                });

                function addPlatform(i=4, n=false) {
                    console.log("added")
                    add([
                        sprite("wall", {
                            width: wallXY,
                            height: wallXY / 2,
                        }),
                        area(),
                        pos(
                            rand(0 + wallXY * 2, width() - wallXY * 2),
                            // 100
                            n == true
                                ? wallXY + rand(-1, 1)
                                : (-i * (wallXY * 15)) / NUM_PLATFORMS + wallXY * 12
                        ),
                        body({ isStatic: true }),
                        anchor("center"),
                        "platform",
                        {
                            speed: rand(50, 120),
                            dir: choose([-1, 1]),
                            answered: false
                        },
                        offscreen({ hide: true }),
                    ]).onDestroy(() => {addPlatform()})
                }

                for (let i = 1; i < NUM_PLATFORMS; i++) {
                    addPlatform(i)
                }

                function spin(speed = 1200) {
                    let spinning = false;
                    return {
                        require: ["rotate"],
                        update(this: any) {
                            if (!spinning) {
                                return;
                            }
                            this.angle -= speed * dt();
                            if (this.angle <= -360) {
                                spinning = false;
                                this.angle = 0;
                            }
                        },
                        spin() {
                            spinning = true;
                        },
                    };
                }

                const player = add([
                    sprite("bean", {
                        width: wallXY,
                    }),
                    pos(center()),
                    anchor("center"),
                    area(),
                    body({ jumpForce: JUMP_FORCE }),
                    spin(),
                    rotate(0),
                    doubleJump()
                ]);
                const time = add([
                    text("Score: 0"),
                    pos(0, 0),
                    fixed(),
                    { value: 0, startTime: new Date() },
                ]);
                const energyText = add([
                    text("Energy: 3"),
                    pos(0, 80),
                    fixed(),
                    { value: 3 },
                ]);

                player.pos = get("platform")[0].pos.sub(0, 64);

                const mapObj = addLevel(gameMap, {
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
                            "wall",
                        ],
                        $: () => [
                            sprite("lava", {
                                width: wallXY,
                                height: wallXY,
                            }),
                            area(),
                            "lava",
                        ],
                    }
                });

                onUpdate("platform", (p) => {
                    // if (p.isOutOfView()) return;
                    if (player.pos.y > p.pos.y-80 && player.pos.y < p.pos.y+80) {
                        // player.move(p.dir * p.speed, 0);
                    }
                    p.move(0, lavaRaiseSpeed);
                    p.move(p.dir * p.speed, 0);
                    get("lava").forEach((o) => {
                        if (p.isColliding(o)) {
                            destroy(p);
                        }
                    });
                    if (
                        p.pos.x < 0 + wallXY * 2 ||
                        p.pos.x > width() - wallXY * 2
                    ) {
                        p.dir = -p.dir;
                    }
                });
                player.onCollide("lava", (_) => go("gameover"));

                // player.onCollide("wall", (o: any) => {
                //     if (player.isColliding(o)) {
                //         player.moveTo(
                //             o.pos.x < player.pos.x
                //                 ? player.pos.x += 10
                //                 : player.pos.x -= 10,
                //             player.pos.y
                //         );
                //     }
                // });
                
                player.onUpdate(() => {
                    // if (player.pos.y > 1000) go("gameover");
                    camPos(player.pos);
                    if (player.pos.y > wallXY * gameMap.length) {go("gameover")}
                });
                player.onDoubleJump(() => {
                    player.spin();
                });

                onKeysDown(["left", "right", "up", "down", "w", "a", "s", "d"], () => {
                    if (player.curAnim() != "run") { player.play("run") }
                })
                onKeysReleased(["left", "right", "up", "down", "w", "a", "s", "d"], () => {
                    player.frame = 0;
                    player.stop();
                })

                onKeysPressed(["space", "w", "up"], () => {
                    if (energyText.value > 0) {
                        energyText.value --;
                        energyText.text = "Energy: "+energyText.value;
                        player.doubleJump();
                    } else {
                        // alert("No energy")
                        // toast({
                        //     title: 'Out of energy',
                        //     description: "Press \"e\" or \"z\" to answer questions and gain energy",
                        //     status: 'error',
                        //     duration: 5000,
                        //     isClosable: true,
                        // })
                    }
                });
                onKeysDown(["left", "a"], () => {
                    player.flipX = true;
                    player.move(-SPEED, 0);
                });
                onKeysDown(["right", "d"], () => {
                    player.flipX = false;
                    player.move(SPEED, 0);
                });
                onKeysPressed(["z", "e", "q"], () => {
                    // setOpen(true)
                    energyText.value += 2;

                    energyText.text = "Energy: "+energyText.value;
                });
                time.onUpdate(() => {
                    var timeDiff = new Date().valueOf() - time.startTime.valueOf();
                    timeDiff /= 1000;
                    var seconds = Math.round(timeDiff);
                    time.value = seconds;
                    time.text = "Score: "+time.value;

                    lavaRaiseSpeed += Math.floor(time.value/2)-lavaRaiseSpeed;
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