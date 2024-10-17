const { assert } = require("chai")
const { network, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe Staging Tests", function () {
          let deployer
          let fundMe
          const sendValue = ethers.parseEther("0.1")
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              fundMe = await ethers.getContract("FundMe", deployer)
              deployer = (await ethers.getSigners())[0]
              const balance = await deployer.getBalance()
              console.log(
                  `Balance of deployer: ${ethers.formatEther(balance)} ETH`,
              )
          })

          it("allows people to fund and withdraw", async function () {
              const fundTxResponse = await fundMe.fund({
                  value: sendValue,
                  gasLimit: ethers.utils.hexlify(100000), // set gas limit
                  gasPrice: ethers.utils.parseUnits("10", "gwei"), // set gas price
              })
              await fundTxResponse.wait(1)
              const withdrawTxResponse = await fundMe.withdraw()
              await withdrawTxResponse.wait(1)

              const endingFundMeBalance = await fundMe.provider.getBalance(
                  fundMe.address,
              )
              console.log(
                  endingFundMeBalance.toString() +
                      " should equal 0, running assert equal...",
              )
              assert.equal(endingFundMeBalance.toString(), "0")
          })
      })
