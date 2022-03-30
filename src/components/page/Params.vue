<template>
    <div class="row-box">
        <!-- <el-form ref="form" :model="form" label-width="200px"  :label-position="'left'" style="display:block">
            <el-form-item :label="$t('i18n.gasConsumeTokenContractName')" >
                <el-input v-model="form.gasContractName" style="width:400px"></el-input>
            </el-form-item>
            <el-form-item :label="$t('i18n.txConsumeGas')" label-width="150px">
                <el-switch v-model="form.txConsumeGas"></el-switch>
            </el-form-item>
            <el-form-item :label="$t('i18n.txGasLimit')"  label-width="110px">
                <el-slider v-model="form.txGasLimit" :min="0" :max="2000000000" show-input input-size="mini" style="width:400px"></el-slider>
            </el-form-item>
            <el-form-item :label="$t('i18n.bkGasLimit')"  label-width="110px">
                <el-slider v-model="form.bkGasLimit" :min="0" :max="20000000000" show-input input-size="mini" style="width:400px"></el-slider>
            </el-form-item>
            <el-form-item :label="$t('i18n.checkDeployPermission')"  style="display:inline-block"  label-width="150px">
                <el-switch v-model="form.checkContractDeployPermission"></el-switch>
            </el-form-item>
            <el-form-item :label="$t('i18n.reviewAfterDeploy')" style="display:inline-block;margin-left:50px"  label-width="200px">
                <el-switch v-model="form.checkContractAfterDeploy"></el-switch>
            </el-form-item>
            <el-form-item :label="$t('i18n.isEmptyBlock')"  style="display:inline-block"   label-width="150px">
                <el-switch v-model="form.allowEmpty"></el-switch>
            </el-form-item>
            <el-form-item :label="$t('i18n.firewall')" style="display:inline-block;"  label-width="150px">
                <el-row :gutter="20">
                    <el-col :span="2">
                        <el-switch v-model="form.fw" disabled></el-switch>
                    </el-col>
                    <el-col :span="18">
                        <el-input style="width=350px;"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item style="margin-top:15px" label-width="230px">
                <el-button type="primary" v-loading='submitLoading' @click="onSubmit">{{$t('i18n.submitChanges')}}</el-button>
            </el-form-item>
        </el-form> -->
        <!-- 交易Gas设置 -->
        <el-row :gutter="20" class="row-box-line">
            <el-col :span="6">
                <p>{{ $t('i18n.txGasLimit') }}</p>
            </el-col>
            <el-col :span="18">
                <el-slider v-model="form.txGasLimit" :min="0" :max="2000000000" show-input input-size="mini"></el-slider>
            </el-col>
        </el-row>
        <!-- 区块Gas设置 -->
        <el-row :gutter="20" class="row-box-line">
            <el-col :span="6">
                <p>{{ $t('i18n.bkGasLimit') }}</p>
            </el-col>
            <el-col :span="18">
                <el-slider v-model="form.bkGasLimit" :min="0" :max="2000000000" show-input input-size="mini"></el-slider>
            </el-col>
        </el-row>
        <!-- 防火墙设置 -->
        <!-- <el-row :gutter="20" class="row-box-line">
            <el-col :span="6">
                <p>{{ $t('i18n.firewall') }}</p>
            </el-col>
            <el-col :span="2">
                <el-switch v-model="form.fw"></el-switch>
            </el-col>
            <el-col :span="16">
                <el-input v-model="form.fwContractAddress" placeholder="input contract address"></el-input>
            </el-col>
        </el-row> -->

        <el-row type="flex" justify="end">
            <el-button type="primary" v-loading='submitLoading' @click="onSubmit">{{$t('i18n.submitChanges')}}</el-button>
        </el-row>
    </div>
</template>

<script>
import { getSystemConfig, setSystemConfig } from '@/api/system'
export default {
    props: {
        chainId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            oldForm: "",
            form: {
                txGasLimit:0,
                bkGasLimit:0,
            },
            submitLoading: false,
            systemTimer: undefined
        };
    },
    methods: {
        getData(){
            getSystemConfig(this.chainId).then((res) => {
                if (res && res.data) {
                    let resData = res.data
                    this.form.txGasLimit = parseInt(resData.txGasLimit)
                    this.form.bkGasLimit = parseInt(resData.blockGasLimit)
                    this.oldForm = JSON.stringify(this.form)
                }
            })

        },
        onSubmit() {
            let resData = JSON.parse(this.oldForm)
            let data = {
                chainID: this.chainId
            }

            if (this.form.txGasLimit != parseInt(resData.txGasLimit)){
                data.TxGasLimit = this.form.txGasLimit.toString()
            }
            if (this.form.bkGasLimit != parseInt(resData.bkGasLimit)){
                data.BlockGasLimit = this.form.bkGasLimit.toString()
            }

            if (this.form.txGasLimit >= this.form.bkGasLimit) {
                this.$message.error("txGasLimit must not bigger than bkGasLimit")
                return
            }
            if (Object.keys(data).length == 1) {
                return
            }
            this.submitLoading = true
            setSystemConfig(data).then((res) => {
                this.$message.success(this.$t('i18n.submitSuccess'))
                this.submitLoading = false
                if (this.systemTimer === undefined) {
                    this.systemTimer = setTimeout(this.getData, 60000)
                }
            }).catch(res =>{
                this.$message.error(this.$t('i18n.submitFailed'));
                this.submitLoading = false
            })
        }
    },
    mounted:function() {
        this.getData()
    },
    beforeDestroy: function () {
        clearInterval(this.systemTimer)
    }
};
</script>
<style scoped>
.row-box {
    width: 700px;
}
.row-box-line {
    margin-bottom: 20px;
}
/deep/ .el-slider .el-slider__input{
    width: 140px;
}
</style>