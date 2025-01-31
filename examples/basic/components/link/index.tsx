/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

import s from './style.module.css'

export default function Link({ text, href }: { text: string; href: string }) {
  return (
    <a className={s.root} href={href}>
      {text}
    </a>
  )
}
