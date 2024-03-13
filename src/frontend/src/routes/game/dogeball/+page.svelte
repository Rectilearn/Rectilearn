<script lang="ts">
	import { onDestroy, onMount } from "svelte";
    import kaboom, { type AreaComp, type GameObj, type KaboomCtx, type PosComp, type SpriteComp, type TextComp } from "kaboom";
    import "kaboom/global";
	import { onKeysDown, onKeysPressed, onKeysReleased } from "../game";
	import { toast } from "svelte-sonner";
    import Toast from "$lib/components/toast.svelte";

    const avatar = "test";

    let cRef: HTMLCanvasElement;

    let kb: KaboomCtx;

    const mapLayout = //26x9
    `
    ||||||||||||||||||||||||||
    |a                      a|
    sa                      a|
    |a                      a|
    ea                      a|
    |a                      a|
    ra                      a|
    |a                      a|
    ||||||||||||||||||||||||||`.split("\n");
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
            await loadSprite("fish", "/sprites/fish.png");
            await loadSprite("bg", "/sprites/spaceBg2.png");

            await loadSprite("teammate", "/sprites/goodBean.png");
            await loadSprite("enemy", "/sprites/badBean.png");

            await loadSprite("spawnArea", "/sprites/spawnArea.png")

            await loadSprite("apple", "/sprites/apple.png");

            await loadSprite("upgradeRange", "/sprites/upgradeRange.png");
            await loadSprite("upgradeRate", "/sprites/upgradeFirerate.png");
            await loadSprite("upgradeS", "/sprites/upgradeSpeed.png");

            let start = false;

            let SPEED = 50
            let RANGE = 250
            let FIRERATE = 5

            add([
                sprite("bg", {
                    width: width(),
                    height: height()
                }),
                pos(0, 0),
                fixed()
            ]);
			const beforeStart: GameObj<TextComp | PosComp>[] = [
				add([
					text("Click Anywhere To Start", {
						size: width() / 25
					}),
					pos(center().x, center().y-60),
					anchor("center"),
				]), 
				add([
					text('use "w", "a", "s" and "d" or arrow keys to move around\npress "space", or "q" to answer questions\npress "e" to deploy troops\nuse "z" to zoom in/out', {
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
                const wallXY = Math.max(width() / itemXLen, height() / itemYLen)
                const mapObj = addLevel(mapLayout, {
                    tileWidth: wallXY,
                    tileHeight: wallXY,
                    tiles: {
                        "|": () => [
                            sprite("wall", {
                                width: wallXY,
                                height: wallXY
                            }),
                            area(),
                            body({ isStatic: true }),
                            "wall"
                        ],
                        " ": () => [
                            sprite("grass", {
                                width: wallXY,
                                height: wallXY
                            })
                        ],
                        "p": () => [
                            sprite("grass", {
                                width: wallXY,
                                height: wallXY
                            })
                        ],
                        "a": () => [
                            sprite("spawnArea", {
                                width: wallXY,
                                height: wallXY
                            })
                        ],
                        "r": () => [
                            sprite("upgradeRange", {
                                width: wallXY,
                                height: wallXY
                            }),
                            area(),
                            body({ isStatic: true }),
                            "upgradeRange"
                        ],
                        "e": () => [
                            sprite("upgradeRate", {
                                width: wallXY,
                                height: wallXY
                            }),
                            area(),
                            body({ isStatic: true }),
                            "upgradeFirerate"
                        ],
                        "s": () => [
                            sprite("upgradeS", {
                                width: wallXY,
                                height: wallXY
                            }),
                            area(),
                            body({ isStatic: true }),
                            "upgradeS"
                        ]
                    }
                });

                scene("defeat", () => {
                    add([
                        text("Defeat!", {
                            size: width() / 25,
                        }),
                        pos(center()),
                        anchor("center"),
                    ]);
                });

                scene("victory", () => {
                    add([
                        text("Victory!", {
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
                    // pos(mapObj.getPos(itemXLen / 2, itemYLen / 2)),
                    pos(itemXLen / 2 * wallXY, itemYLen / 2 * wallXY),
                    area(),
                    body()
                ]);
                const cash = add([
                    text("Cash: 0"),
                    pos(0, 0),
                    fixed(),
                    { value: 0 },
                ])

                var zoomOut = false

                // var p = player.pos;

                var closestEnemy = {x: mapLayout[0].length * wallXY * 2, y: 0}
                var closestTeammate = {x: 0, y: 0}

                var teammates: GameObj<SpriteComp | PosComp | AreaComp | { speed: number, lastShot: any }>[] = [];
				let enemies: GameObj<SpriteComp | PosComp | AreaComp | { speed: number, lastShot: any }>[] = [];

                function deployEnemy() {
                    const enemy = add([
                        sprite("enemy", {
                            width: wallXY,
                        }),
                        // pos(mapObj.getPos(24, rand(1,7))),
                        pos(24 * wallXY, rand(1, 7) * wallXY),
                        area(),
                        {speed: SPEED*0.9+rand(-SPEED/10, SPEED/10), lastShot: new Date()}
                    ]);
                    enemy.flipX = true;
                    enemies.push(enemy);
                    enemy.onUpdate(() => {
                        if (enemy.pos.x < closestEnemy.x) {closestEnemy.x=enemy.pos.x; closestEnemy.y=enemy.pos.y}

                        // if (enemy.pos.x < mapObj.getPos(2.2, 0).x) {go("defeat")}
                        if (enemy.pos.x < 2.2 * wallXY) go("defeat")

                        if (enemy.pos.x <= closestTeammate.x+RANGE) {
                            if ((new Date().valueOf() - enemy.lastShot.valueOf())/1000 > FIRERATE) {
                                enemy.lastShot = new Date()

                                const m = {'x': closestTeammate.x, 'y': closestTeammate.y}
                                    
                                const e: any = add([
                                    sprite("apple", {
                                        width: wallXY,
                                    }),
                                    pos(enemy.pos.x, enemy.pos.y),
                                    lifespan(2),
                                    area(),
                                    {
                                        speed: 100,
                                        di: [
                                            m["x"] - enemy.pos.x - 50,
                                            m["y"] - enemy.pos.y - 50,
                                        ],
                                    },
                                ]);
                                e.onUpdate(() => {
                                    e.move(e.di[0], e.di[1]);
                                    for (let i = 0; i < teammates.length; i++) {
                                        if (e.isColliding(teammates[i])) {
                                            teammates[i].pos.x=0-mapLayout[0].length*wallXY;
                                            teammates[i].destroy();
                                            teammates.splice(i, 1)
                                            e.destroy();
                                            closestTeammate.x=0-mapLayout[0].length*wallXY
                                            break
                                        }
                                    }
                                });
                            }

                        } else {
                            enemy.move(-enemy.speed, 0)
                        }
                    })
                };

                function deployTeammate() {
                    const teammate = add([
                        sprite("teammate", {
                            width: wallXY,
                        }),
                        // pos(mapObj.getPos(1, rand(1,7))),
                        pos(wallXY, rand(1, 7) * wallXY),
                        area(),
                        {speed: SPEED+rand(-SPEED/20, SPEED/20), lastShot: new Date()}
                    ]);
                    teammates.push(teammate)
                    teammate.onDestroy(() => {teammate.pos.x = 0})
                    teammate.onUpdate(() => {
                        if (teammate.pos.x > closestTeammate.x) {closestTeammate.x=teammate.pos.x; closestTeammate.y=teammate.pos.y}

                        if (teammate.pos.x > 22.8 * wallXY) go("victory")

                        if (teammate.pos.x >= closestEnemy.x-RANGE) {
                            if ((new Date().valueOf() - teammate.lastShot.valueOf())/1000 > FIRERATE) {
                                teammate.lastShot = new Date()

                                const m = {x: closestEnemy.x, y: closestEnemy.y}

                                const p = {x: teammate.pos.x, y: teammate.pos.y}

                                wait(rand(), () => {
                                        
                                    const e: any = add([
                                        sprite("apple", {
                                            width: wallXY,
                                        }),
                                        pos(p.x, p.y),
                                        lifespan(2),
                                        area(),
                                        {
                                            speed: 100,
                                            di: [
                                                m["x"] - p.x - 50,
                                                m["y"] - p.y - 50,
                                            ],
                                        },
                                    ]);
                                    e.onUpdate(() => {

                                        e.move(e.di[0], e.di[1]);
                                        for (let i = 0; i < enemies.length; i++) {
                                            if (e.isColliding(enemies[i])) {
                                                enemies[i].pos.x=mapLayout[0].length*2*wallXY;
                                                enemies[i].destroy();
                                                enemies.splice(i, 1)
                                                e.destroy();
                                                closestEnemy.x=mapLayout[0].length*2*wallXY;
                                                break
                                            }
                                        }
                                    });
                                })
                            }
                        } else {
                            teammate.move(teammate.speed, 0)
                        }
                    })
                };

                const check = setInterval(() => {
                    if (teammates.length > enemies.length) {
                        wait(rand(2, 7), () => {
                            if (teammates.length > enemies.length) {
                                for (let i = 0; i < (teammates.length-enemies.length)+rand(0-teammates.length/2,teammates.length/2); i++) {
                                    deployEnemy()
                                }
                            }
                        })

                    }
                    if (rand() > 0.9) {
                        for (let i=0; i<10; i++) {
                            deployEnemy()
                        }
                    }
                }, 3000);                 

                player.onUpdate(() => {
                    camPos(player.pos);
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
                    player.move(-400, 0);
                });
                onKeysDown(["right", "d"], () => {
                    player.flipX = false;
                    player.move(400, 0);
                });
                onKeysDown(["up", "w"], () => {
                    player.move(0, -400);
                });
                onKeysDown(["down", "s"], () => {
                    player.move(0, 400);
                });

                onKeyPress("z", () => {
                    zoomOut = !zoomOut
                    if (zoomOut == true) {
                        // p = mapObj.getPos(13, 4)
                        player.pos = vec2(13 * wallXY, 4 * wallXY);
                        camScale(vec2(0.5));
                    } else {
                        camScale(vec2(1.0));
                        //  = player.pos;
                    }
                })

                onKeysPressed(["space", "q"], () => {
                    // setOpen(true)
                    cash.value += 3;
                    cash.text = "Cash: "+cash.value;
                })

                onKeyPress("e", () => {
                    if (cash.value > 0) {
                        cash.value --;
                        cash.text = "Cash: "+cash.value;

                        for (let x=0; x < 2; x++) {
                            deployTeammate()
                            // wait(rand(1, 5), () => {
                            //     if (teammates.length < 10) {
                            //         deployEnemy()
                            //     } else {
                            //         if (rand() > 0.2) {
                            //             deployEnemy()
                            //         }
                            //     }
                            // })
                            // wait(rand(10, 30), () => {
                            //     if (teammates.length*0.95 > enemies.length) {
                            //         deployEnemy()
                            //     }
                            // })
                        }
                    } else {
                        // alert("out of cash");
                        toast.error("Out of cash", {
                            description: "Press \"space\" to answer questions and earn cash.",
                            duration: 5000,
                        })
                        // toast({
                        //     title: 'Out of cash',
                        //     description: "Press \"space\" to answer questions and earn cash.",
                        //     status: 'error',
                        //     duration: 5000,
                        //     isClosable: true,
                        // })
                    }
                })


                onKeyPress("f", () => {

                    let touching = false

                    get("upgradeS", { recursive: true }).forEach((s: any) => {
                        if (player.isColliding(s))
                        touching = true;
                    });
                    if (touching) {

                        if (cash.value >= SPEED/10) {
                           cash.value -= SPEED/10
                           cash.text = "Cash: " + cash.value;
                           SPEED += 50;
                        } else {
                            // alert("Not enough " + SPEED/10);
                            toast.warning("Not enough money", {
                                description: "you need $"+SPEED/10+" for that upgrade!",
                                duration: 5000
                            });
                            // toast({
                            //     title: 'Not enough money',
                            //     description: "you need $"+SPEED/10+" for that upgrade!",
                            //     status: 'warning',
                            //     duration: 5000,
                            //     isClosable: true,
                            // })
                        }
                    }

                    touching=false

                    get("upgradeRange", { recursive: true }).forEach((s: any) => {
                        if (player.isColliding(s))
                        touching = true;
                    });
                    if (touching) {

                        if (cash.value >= RANGE/50) {
                           cash.value -= RANGE/50
                           cash.text = "Cash: " + cash.value;
                           RANGE += 50;
                        } else {
                            // alert("Not enough " + RANGE/50);
                            toast.warning("Not enough money", {
                                description: "you need $"+RANGE/50+" for that upgrade!",
                                duration: 5000
                            });
                            // toast({
                            //     title: 'Not enough money',
                            //     description: "you need $"+RANGE/50+" for that upgrade!",
                            //     status: 'warning',
                            //     duration: 5000,
                            //     isClosable: true,
                            // })
                        }
                    }

                    touching = false;

                    get("upgradeFirerate", { recursive: true }).forEach((s: any) => {
                        if (player.isColliding(s))
                        touching = true;
                    });
                    if (touching) {

                        if (cash.value >= 10+Math.floor(2*(5-FIRERATE))) {
                           cash.value -= 10+Math.floor(2*(5-FIRERATE))
                           cash.text = "Cash: " + cash.value;
                           FIRERATE /= 1.2;
                        } else {
                            // alert("Not enough " + (10+Math.floor(2*(5-FIRERATE))))
                            toast.warning("Not enough money", {
                                description: "you need $"+(10+Math.floor(2*(5-FIRERATE)))+" for that upgrade!",
                                duration: 5000
                            });
                            // toast({
                            //     title: 'Not enough money',
                            //     description: "you need $"+(10+Math.floor(2*(5-FIRERATE)))+" for that upgrade!",
                            //     status: 'warning',
                            //     duration: 5000,
                            //     isClosable: true,
                            // })
                        }
                    }

                    touching=false
                });

                get("upgradeS", { recursive: true }).forEach((s: any) => {
                    var enabled = false
                    s.onUpdate(() => {
                        if (player.isColliding(s) && enabled == false) {
                            enabled = true;
                            toast.info("Upgrade Speed", {
                                description: "Press \"F\" to upgrade your teams speed.",
                                duration: 3000
                            });
                            // toast({
                            //     title: 'Upgrade Speed',
                            //     description: "Press \"F\" to upgrade your teams speed.",
                            //     status: 'info',
                            //     variant: "left-accent",
                            //     duration: 3000,
                            //     isClosable: true,
                            // })
                            wait(3.1, () => {enabled = false})
                        }
                    })
                });

                get("upgradeFirerate", { recursive: true }).forEach((s: any) => {
                    var enabled = false
                    s.onUpdate(() => {
                        if (player.isColliding(s) && enabled == false) {
                            enabled = true
                            toast.info("Upgrade Firerate", {
                                description: "Press \"F\" to upgrade your teams firerate.",
                                duration: 3000
                            });
                            // toast({
                            //     title: 'Upgrade Firerate',
                            //     description: "Press \"F\" to upgrade your teams firerate.",
                            //     status: 'info',
                            //     variant: "left-accent",
                            //     duration: 3000,
                            //     isClosable: true,
                            // })
                            wait(3.1, () => {enabled = false})
                        }
                    })
                });

                get("upgradeRange", { recursive: true }).forEach((s: any) => {
                    var enabled = false
                    s.onUpdate(() => {
                        if (player.isColliding(s) && enabled == false) {
                            enabled = true
                            toast.info("Upgrade Range", {
                                description: "Press \"F\" to upgrade your teams range.",
                                duration: 3000
                            });
                            // toast({
                            //     title: 'Upgrade Range',
                            //     description: "Press \"F\" to upgrade your teams range.",
                            //     status: 'info',
                            //     variant: "left-accent",
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