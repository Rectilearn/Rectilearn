<script lang="ts">
	import { onDestroy, onMount } from "svelte";
    import kaboom, { type KaboomCtx } from "kaboom";
    import "kaboom/global";
	import { onKeysDown, onKeysReleased } from "../game";
	import { toast } from "svelte-sonner";
    import Toast from "$lib/components/toast.svelte";

    const avatar = "test";

    let cRef: HTMLCanvasElement;

    let kb: KaboomCtx;


    const mapLayout =
    `
    |||||||||||||||||
    |               |
    |SS             |
    |SS             |
    |            $  |
    |QQ         $$  |
    |QQ        $$$$ |
    |          $$$$ |
    |!         $$$$ |
    |           $$  |
    |@              |
    |||||||||||||||||`.split("\n");
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
            await loadSprite("bg", "/sprites/grassBg.png");
            await loadSprite("rod", "/sprites/rod.png");

            await loadSprite("money", "/sprites/money.png");
            await loadSprite("store", "/sprites/store.png");
            await loadSprite("questions", "/sprites/questions.png");

            await loadSprite("upgradeM", "/sprites/upgradeMoney.png");
            await loadSprite("upgradeS", "/sprites/upgradeSpeed.png");

            let start = false;
            let SPEED = 400;
            let COST = 1;
            add([
                sprite("bg", {
                    width: width(),
                    height: height()
                }),
                pos(0, 0),
                fixed()
            ]);
            const beforeStart = add([
                text("Click Anywhere To Start", {
                    size: width() / 25
                }),
                pos(center()),
                anchor("center"),
            ]);
            async function startGame() {
                if (start) return;
                // debug.inspect = true
                start = true;
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
                            offscreen({ hide: true }),
                        ],
                        "$": () => [
                            sprite("water", {
                                width: wallXY,
                                height: wallXY
                            }),
                            area(),
                            body({ isStatic: true }),
                            offscreen({ hide: true }),
                            "water"
                        ],
                        "S": () => [
                            sprite("store", {
                                width: wallXY,
                                height: wallXY
                            }),
                            area(),
                            body({ isStatic: true }),
                            offscreen({ hide: true }),
                            "store"
                        ],
                        "!": () => [
                            sprite("upgradeM", {
                                width: wallXY,
                                height: wallXY
                            }),
                            area(),
                            body({ isStatic: true }),
                            offscreen({ hide: true }),
                            "upgradeM"
                        ],
                        "@": () => [
                            sprite("upgradeS", {
                                width: wallXY,
                                height: wallXY
                            }),
                            area(),
                            body({ isStatic: true }),
                            offscreen({ hide: true }),
                            "upgradeS"
                        ],
                        "Q": () => [
                            sprite("questions", {
                                width: wallXY,
                                height: wallXY
                            }),
                            area(),
                            body({ isStatic: true }),
                            offscreen({ hide: true }),
                            "questions"
                        ],
                        " ": () => [
                            sprite("grass", {
                                width: wallXY,
                                height: wallXY
                            }),
                            offscreen({ hide: true }),
                        ]
                    }
                });
                const player = add([
                    sprite("bean", {
                        width: wallXY,
                    }),
                    // pos(mapObj.getAt(itemXLen / 2, itemYLen / 2)),
                    pos(900, 500),
                    area(),
                    body()
                    // body({ isStatic: true }),
                ]);
                const rod = add([
                    sprite("rod", {
                        height: wallXY
                    }),
                    pos(),
                    follow(player, vec2(wallXY * 0.7, -wallXY * 0.3)),
                    rotate(0),
                    spin()
                ]);
                const cash = add([
                    text("Cash: 0"),
                    pos(0, 0),
                    fixed(),
                    { value: 0 },
                ])
                const fish = add([
                    text("Fish: 0"),
                        pos(0, 80),
                        fixed(),
                        { value: 0 },
                    ])
                const bait = add([
                text("Bait: 0"),
                    pos(0, 160),
                    fixed(),
                    { value: 0 },
                ])
                function spin() {
                    let spinning = false
                    return {
                        id: "spin",
                        update() {
                            const t = this as any;
                            if (spinning) {
                                t.angle += 1200 * dt()
                                if (t.angle >= 360) {
                                    t.angle = 0
                                    spinning = false
                                }
                            }
                        },
                        spin() {
                            spinning = true
                        },
                    }
                }
                beforeStart.destroy();
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
                    rod.flipX = true;
                    rod.follow.offset = vec2(-wallXY * 0.7, -wallXY * 0.3);
                    player.move(-SPEED, 0);
                });
                onKeysDown(["right", "d"], () => {
                    player.flipX = false;
                    rod.flipX = false;
                    rod.follow.offset = vec2(wallXY * 0.7, -wallXY * 0.3)
                    player.move(SPEED, 0);
                });
                onKeysDown(["up", "w"], () => {
                    player.move(0, -SPEED);
                });
                onKeysDown(["down", "s"], () => {
                    player.move(0, SPEED);
                });
                onKeyPress("space", () => {
                    let touching = false;
                    get("water", { recursive: true }).forEach((s: any) => {
                        // console.log(player, s, player.isColliding(s));
                        if (player.isColliding(s)) {
                            // alert("yes touch");
                            touching = true;
                        }
                    });
                    bait.value = 3;
                    if (touching && bait.value > 0) {
                        // alert("fish")
                        const f = add([
                            sprite("fish", {
                                width: wallXY
                            }),
                            pos(rod.pos),
                            lifespan(1),
                        ]);
                        let fPos=100
                        f.onUpdate(() => {
                            fPos-=8;
                            (f as any).moveTo(player.pos.x + fPos, (f as any).pos.y-((1.2*fPos-100)^2)-50);
                            if (-((fPos-100)^2)-50 > 52) {
                                destroy(f);
                            }
                        })
                        bait.value --;
                        bait.text = "Bait: " + bait.value
                        rod.spin();
                        fish.value ++;
                        fish.text = "Fish: " + fish.value
                    }

                    touching=false

                    get("store", { recursive: true }).forEach((s: any) => {
                        if (player.isColliding(s))
                        touching = true;
                    });

                    if (touching && fish.value>0) {
                        const dollar = add([
                            sprite("money", {
                                width: wallXY
                                
                            }),
                            pos(player.pos),
                            lifespan(1),
                        ]);
                        dollar.onUpdate(() => {
                            (dollar as any).moveTo((dollar as any).pos.x+1, (dollar as any).pos.y-10);
                        })
                        fish.value --;
                        fish.text = "Fish: " + fish.value;
                        cash.value += COST;
                        cash.text = "Cash: " + cash.value;
                    }

                    touching=false

                    get("questions", { recursive: true }).forEach((s: any) => {
                        if (player.isColliding(s))
                        touching = true;
                    });

                    if (touching) {
                        // setOpen(true)
                        alert("Open")

                        bait.value ++;
                        bait.text = "Bait: " + bait.value;
                    }

                    touching=false

                    get("upgradeM", { recursive: true }).forEach((s: any) => {
                        if (player.isColliding(s))
                        touching = true;
                    });

                    if (touching) {

                        if (cash.value >= COST*5) {
                            cash.value -= COST*5 
                            cash.text = "Cash: " + cash.value;
                            COST += COST;
                        } else {
                            // alert("Not enough money");
                            toast.warning("Not enough money", {
                                description: "you need $"+COST*5+" for that upgrade!",
                                duration: 5000
                            });
                            // toast({
                            //     title: 'Not enough money',
                            //     description: "you need $"+COST*5+" for that upgrade!",
                            //     status: 'warning',
                            //     duration: 5000,
                            //     isClosable: true,
                            // })
                        }
                    }

                    touching = false;

                    get("upgradeS", { recursive: true }).forEach((s: any) => {
                        if (player.isColliding(s))
                        touching = true;
                    });

                    if (touching) {

                        if (cash.value >= SPEED/20) {
                            cash.value -= SPEED/20 
                            cash.text = "Cash: " + cash.value;
                            SPEED += 200;
                        } else {
                            // alert("not enough money")
                            toast.warning("Not enough money", {
                                description: "you need $"+SPEED/20+" for that upgrade!",
                                duration: 5000
                            });
                            // toast({
                            //     title: 'Not enough money',
                            //     description: "you need $"+SPEED/20+" for that upgrade!",
                            //     status: 'warning',
                            //     duration: 5000,
                            //     isClosable: true,
                            // })
                        }
                    }

                    touching=false
                });

                get("upgradeM", { recursive: true }).forEach((s: any) => {
                    var enabled = false
                    s.onUpdate(() => {
                        if (player.isColliding(s) && enabled == false) {
                            enabled = true;
                            toast.info("Upgrade Money Per Question", {
                                description: "Press \"F\" to upgrade money earned after answering a question.",
                                duration: 3000
                            });
                            // alert("Upgrade")
                            // toast({
                            //     title: 'Upgrade Money Per Question',
                            //     description: "Press \"F\" to upgrade money earned after answering a question.",
                            //     status: 'info',
                            //     variant: "left-accent",
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
                            // alert("Upgrade speed");
                            // toast({
                            //     title: 'Upgrade Speed',
                            //     description: "Press \"F\" to upgrade your running speed.",
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