<template>
    <div class="spinner" v-show="visible">
        <div class="wrap">
            <span class="rect1"></span>
            <span class="rect2"></span>
            <span class="rect3"></span>
            <span class="rect4"></span>
            <span class="rect5"></span>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            visible: false,

        };
    },
};
</script>

<style lang="scss" scoped>
.spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%, -50%);
    z-index: 99;
    margin-left: -20px;

    width: 60px;
    height: 40px;
    text-align: center;
    font-size: 10px;
    .wrap {
        width: 60px;
        height: 40px;
        position: relative;
        span {
            background-color: rgb(70, 180, 109);
            height: 100%;
            width: 6px;
            display: inline-block;
            margin: 0 3px 0 0;
            -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
            animation: sk-stretchdelay 1.2s infinite ease-in-out;
        }
        .rect2 {
            -webkit-animation-delay: -1.1s;
            animation-delay: -1.1s;
        }
        .rect3 {
            -webkit-animation-delay: -1s;
            animation-delay: -1s;
        }
        .rect4 {
            -webkit-animation-delay: -0.9s;
            animation-delay: -0.9s;
        }
        .rect5 {
            -webkit-animation-delay: -0.8s;
            animation-delay: -0.8s;
        }

        @-webkit-keyframes sk-stretchdelay {
            0%,
            40%,
            100% {
                -webkit-transform: scaleY(0.4);
            }
            20% {
                -webkit-transform: scaleY(1);
            }
        }

        @keyframes sk-stretchdelay {
            0%,
            40%,
            100% {
                transform: scaleY(0.4);
                -webkit-transform: scaleY(0.4);
            }
            20% {
                transform: scaleY(1);
                -webkit-transform: scaleY(1);
            }
        }
    }
}
</style>
