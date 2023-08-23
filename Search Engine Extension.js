// ==UserScript==
// @name         搜索引擎切换脚本（点击图标显示搜索框）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在页面左侧边添加搜索引擎切换栏，支持谷歌、百度和必应搜索切换，点击图标显示搜索框，切换图标时切换搜索框
// @author       duoqixiaozei
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const engines = [
        { name: "谷歌", url: "https://www.google.com/search?q=", icon: "https://www.google.com/favicon.ico" },
        { name: "百度", url: "https://www.baidu.com/s?wd=", icon: "https://www.baidu.com/favicon.ico" },
        { name: "必应", url: "https://www.bing.com/search?q=", icon: "https://www.bing.com/favicon.ico" }
    ];

    let searchInputs = [];
    let currentEngineIndex = -1;

    function createSwitchBar() {
        const switchBar = document.createElement("div");
        switchBar.style.position = "fixed";
        switchBar.style.left = "10px";
        switchBar.style.top = "50%";
        switchBar.style.transform = "translateY(-50%)";
        switchBar.style.display = "flex";
        switchBar.style.flexDirection = "column"; // 竖向排列

        engines.forEach((engine, index) => {
            const button = document.createElement("button");
            const icon = document.createElement("img");
            icon.src = engine.icon;
            icon.style.width = "24px"; // 缩小
            icon.style.height = "24px"; // 缩小
            button.appendChild(icon);

            // 添加CSS样式
            button.style.marginBottom = "10px"; // 增加间距
            button.style.border = "none";
            button.style.background = "none";
            button.style.cursor = "pointer";
            button.style.transition = "transform 0.2s ease"; // 添加过渡效果

            // 鼠标悬停时添加抖动效果
            button.addEventListener("mouseenter", () => {
                button.style.transform = "scale(1.1) rotate(2deg)";
            });
            button.addEventListener("mouseleave", () => {
                button.style.transform = "scale(1) rotate(0)";
            });

            button.addEventListener("click", () => {
                if (searchInputs[currentEngineIndex]) {
                    searchInputs[currentEngineIndex].style.display = "none";
                }
                currentEngineIndex = index;
                if (!searchInputs[currentEngineIndex]) {
                    const searchInput = document.createElement("input");
                    searchInput.style.position = "fixed";
                    searchInput.style.left = "50%";
                    searchInput.style.top = "50%";
                    searchInput.style.transform = "translate(-50%, -50%)";
                    searchInput.style.width = "240px"; // 扩大两倍
                    searchInput.style.textAlign = "center";
                    searchInput.style.padding = "5px";
                    searchInput.style.display = "block";
                    searchInput.style.zIndex = "9999"; // 设置z-index以确保搜索框位于页面顶部
                    searchInput.value = ""; // 清空搜索框内容
                    searchInput.placeholder = `在${engine.name}中搜索...`;
                    searchInput.addEventListener("keypress", event => {
                        if (event.key === "Enter") {
                            const searchTerm = searchInput.value;
                            if (searchTerm) {
                                window.location.href = engines[currentEngineIndex].url + encodeURIComponent(searchTerm);
                            }
                        }
                    });
                    searchInputs[currentEngineIndex] = searchInput;
                    document.body.appendChild(searchInput);
                    searchInput.focus();
                } else {
                    searchInputs[currentEngineIndex].style.display = "block";
                    searchInputs[currentEngineIndex].focus();
                }
            });

            switchBar.appendChild(button);
        });

        document.body.appendChild(switchBar);
    }

    createSwitchBar();
})();
