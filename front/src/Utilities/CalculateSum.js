
export default function CalculateSum({selectedOptionArr}) {
  let sum=0;
  selectedOptionArr?.map(el=>{
    sum+=Number(el?.unitPrice) * Number(el?.totalQuantity);
  });

  console.log('sum',sum);
  return sum;
}
