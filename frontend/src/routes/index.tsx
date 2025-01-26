import { createFileRoute } from '@tanstack/react-router';

import { useSuspenseListVotes } from '@/queries/api/pollsterComponents';
import { listVotesQuery } from '@/queries/api/pollsterFunctions';
import { queryClient } from '@/queries/client';
import { convertQueryOpts } from '@/queries/utils';

export const Route = createFileRoute('/')({
    component: Index,
    loader: () => queryClient.ensureQueryData(convertQueryOpts(listVotesQuery({}))),
});

const ipsum = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ut purus lobortis, hendrerit eros lobortis, imperdiet ipsum. Maecenas feugiat viverra nisl vel interdum. Suspendisse id venenatis est, nec tincidunt enim. Fusce commodo pellentesque tellus, eget pellentesque nunc posuere quis. Proin pretium enim id bibendum semper. Suspendisse in sollicitudin sapien. Ut dignissim, nisl vel placerat finibus, odio purus dictum est, faucibus viverra justo felis sit amet nisi. Sed elementum metus lorem, at ullamcorper ex fringilla eget. Maecenas at mauris sed nisl aliquet ultrices eu vel ligula. Vivamus ornare purus pharetra purus aliquet varius. Curabitur ac convallis dolor. Integer eleifend egestas eleifend. Nulla ut blandit metus. Vestibulum vel elit lacinia, condimentum nisi sed, laoreet nibh. In ut convallis sem.

Donec id lacus et mauris placerat venenatis sed id leo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Duis eget dolor quam. Mauris egestas dignissim mi, sit amet varius nibh dictum sit amet. Ut egestas ex non condimentum tincidunt. Ut mattis urna sed libero elementum eleifend. Nam varius risus sed convallis tristique. Sed faucibus lacus quis leo luctus, commodo tempor eros blandit. Donec nec risus eget tortor lobortis facilisis. Vivamus suscipit, mi non aliquet viverra, mi justo vulputate eros, a feugiat dui sapien eget diam. Cras blandit odio at aliquet efficitur.

Ut mollis diam non mollis mattis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Ut a dui suscipit, mollis massa et, hendrerit nunc. Mauris viverra dolor tellus, sed rutrum dui finibus eu. Morbi maximus quam non justo varius eleifend. Praesent eu purus ornare, laoreet felis sed, ornare erat. Nullam finibus pellentesque consequat. Sed nec cursus magna. Nunc laoreet ligula in lectus molestie sagittis. Aliquam erat volutpat. Cras molestie et nulla at vestibulum. Maecenas feugiat id libero sit amet fermentum.

Praesent quis fringilla neque. Sed blandit massa eget orci mattis sodales non id lectus. Ut interdum ac sapien eu dignissim. Integer nibh lacus, ultrices a aliquet euismod, molestie eget lectus. Aliquam ultricies eros vel dui euismod tempor. Nam sed quam non arcu bibendum mollis. Vivamus nec nibh eget tortor porttitor tempor vehicula in ante. Aliquam mollis ultrices dictum. Pellentesque ultricies hendrerit felis venenatis tincidunt. Proin libero arcu, lacinia in lectus id, pulvinar fermentum odio. Integer et nisi lacinia, aliquam nisl vel, tempor tortor. Aliquam tincidunt diam non nisl gravida bibendum. Nulla quis viverra massa. Aliquam varius pretium libero, non pellentesque enim ullamcorper vitae. Cras nec metus sed quam rutrum vestibulum id eu magna.

Vestibulum tempor lobortis lectus finibus consectetur. Sed tincidunt aliquam eros. Proin nec felis interdum, scelerisque massa eu, elementum justo. In mattis arcu eu lacus pellentesque, eu aliquam tellus vulputate. Morbi dolor diam, consequat nec volutpat sit amet, iaculis nec sapien. Ut cursus neque vitae est varius fringilla. Proin eget nisi at lacus laoreet hendrerit. Vestibulum ut sem nunc. Vivamus volutpat purus neque, a mattis libero eleifend vitae. Praesent felis leo, fermentum sit amet posuere et, tincidunt sit amet ex. Sed eu eleifend turpis. Praesent porta ultricies fringilla.`;

function Index() {
    const { data: votes } = useSuspenseListVotes({});
    console.log(votes);
    return <p className="whitespace-pre-wrap">{ipsum}</p>;
}
