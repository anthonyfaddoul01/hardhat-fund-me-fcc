const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("FundMe", async function () {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.parseEther("1")
    beforeEach(async function () {
        // const accounts = await ethers.getSigners()
        // const accountZero = accounts[0]
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer,
        )
    })

    describe("constructor", async function () {
        it("sets the aggregator addresses correctly", async function () {
            const response = await fundMe.getPriceFeed()
            assert.equal(response, mockV3Aggregator.target)
        })
    })

    describe("fund", async function () {
        it("fails if you don't send enough ETH", async function () {
            await expect(fundMe.fund()).to.be.revertedWith(
                "You need to spend more ETH!",
            )
        })
        it("Updates the amount funded data structure", async function () {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getAddressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Adds funder to array of getFunder", async function () {
            await fundMe.fund({ value: sendValue })
            const funder = await fundMe.getFunder(0)
            assert.equal(funder, deployer)
        })
    })
    describe("withdraw", async function () {
        beforeEach(async () => {
            await fundMe.fund({ value: sendValue })
        })
        it("withdraws ETH from a single funder", async () => {
            // Arrange
            const provider = ethers.provider
            const startingFundMeBalance = await provider.getBalance(
                fundMe.target,
            )
            const startingDeployerBalance = await provider.getBalance(deployer)

            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait()

            const gasPrice =
                transactionReceipt.effectiveGasPrice ||
                transactionResponse.gasPrice

            const gasUsed = transactionReceipt.gasUsed
            const gasPriceBigInt = gasPrice

            const gasCost = gasUsed * gasPriceBigInt

            const endingFundMeBalance = await provider.getBalance(fundMe.target)
            const endingDeployerBalance = await provider.getBalance(deployer)

            const startingFundMeBalanceBigInt = startingFundMeBalance
            const startingDeployerBalanceBigInt = startingDeployerBalance

            // Assert
            assert.equal(endingFundMeBalance.toString(), "0")
            assert.equal(
                (
                    startingFundMeBalanceBigInt + startingDeployerBalanceBigInt
                ).toString(),
                (endingDeployerBalance + gasCost).toString(),
            )
        })
        it("CHEAPER WITHDARWWWW 1", async function () {
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i],
                )
                await fundMeConnectedContract.fund({ value: sendValue })
                const fundedAmount = await fundMe.getAddressToAmountFunded(
                    accounts[i].address,
                )
                assert.equal(fundedAmount.toString(), sendValue.toString())
            }

            const provider = ethers.provider
            const startingFundMeBalance = await provider.getBalance(
                fundMe.target,
            )
            const startingDeployerBalance = await provider.getBalance(deployer)

            // Act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            const gasPrice =
                transactionReceipt.effectiveGasPrice ||
                transactionResponse.gasPrice

            const gasUsed = transactionReceipt.gasUsed
            const gasPriceBigInt = gasPrice

            const gasCost = gasUsed * gasPriceBigInt

            const endingFundMeBalance = await provider.getBalance(fundMe.target)
            const endingDeployerBalance = await provider.getBalance(deployer)

            const startingFundMeBalanceBigInt = startingFundMeBalance
            const startingDeployerBalanceBigInt = startingDeployerBalance

            assert.equal(endingFundMeBalance.toString(), "0")
            assert.equal(
                (
                    startingFundMeBalanceBigInt + startingDeployerBalanceBigInt
                ).toString(),
                (endingDeployerBalance + gasCost).toString(),
            )

            await expect(fundMe.getFunder(0)).to.be.reverted

            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i],
                )
                await fundMeConnectedContract.fund({ value: sendValue })
            }
        })
        it("Only allows the owner to withdraw", async function () {
            const accounts = await ethers.getSigners()
            const fundMeConnectedContract = await fundMe.connect(accounts[1])
            await expect(
                fundMeConnectedContract.withdraw(),
            ).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner")
        })
        it("withdraws ETH from a single funder", async () => {
            // Arrange
            const provider = ethers.provider
            const startingFundMeBalance = await provider.getBalance(
                fundMe.target,
            )
            const startingDeployerBalance = await provider.getBalance(deployer)

            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait()

            const gasPrice =
                transactionReceipt.effectiveGasPrice ||
                transactionResponse.gasPrice

            const gasUsed = transactionReceipt.gasUsed
            const gasPriceBigInt = gasPrice

            const gasCost = gasUsed * gasPriceBigInt

            const endingFundMeBalance = await provider.getBalance(fundMe.target)
            const endingDeployerBalance = await provider.getBalance(deployer)

            const startingFundMeBalanceBigInt = startingFundMeBalance
            const startingDeployerBalanceBigInt = startingDeployerBalance

            // Assert
            assert.equal(endingFundMeBalance.toString(), "0")
            assert.equal(
                (
                    startingFundMeBalanceBigInt + startingDeployerBalanceBigInt
                ).toString(),
                (endingDeployerBalance + gasCost).toString(),
            )
        })
        it("cheaper withdraw", async function () {
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i],
                )
                await fundMeConnectedContract.fund({ value: sendValue })
                const fundedAmount = await fundMe.getAddressToAmountFunded(
                    accounts[i].address,
                )
                assert.equal(fundedAmount.toString(), sendValue.toString())
            }

            const provider = ethers.provider
            const startingFundMeBalance = await provider.getBalance(
                fundMe.target,
            )
            const startingDeployerBalance = await provider.getBalance(deployer)

            // Act
            const transactionResponse = await fundMe.cheaperWithdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            const gasPrice =
                transactionReceipt.effectiveGasPrice ||
                transactionResponse.gasPrice

            const gasUsed = transactionReceipt.gasUsed
            const gasPriceBigInt = gasPrice

            const gasCost = gasUsed * gasPriceBigInt

            const endingFundMeBalance = await provider.getBalance(fundMe.target)
            const endingDeployerBalance = await provider.getBalance(deployer)

            const startingFundMeBalanceBigInt = startingFundMeBalance
            const startingDeployerBalanceBigInt = startingDeployerBalance

            assert.equal(endingFundMeBalance.toString(), "0")
            assert.equal(
                (
                    startingFundMeBalanceBigInt + startingDeployerBalanceBigInt
                ).toString(),
                (endingDeployerBalance + gasCost).toString(),
            )

            await expect(fundMe.getFunder(0)).to.be.reverted

            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i],
                )
                await fundMeConnectedContract.fund({ value: sendValue })
            }
        })
    })
})
